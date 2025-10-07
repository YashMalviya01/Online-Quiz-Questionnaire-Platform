// Advanced Audio Detection Engine
// Detects multiple speakers, background voices, and suspicious audio patterns

class AudioDetection {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.dataArray = null;
    this.isListening = false;
    this.alertCallback = null;
    this.startTime = null;
    this.lastAlertTime = 0;
    this.suspiciousAudioCount = 0;
    this.debugEnabled = typeof import.meta !== 'undefined' && import.meta.env && Boolean(import.meta.env.DEV);
    
    // Speech detection state
    this.speechHistory = [];
    this.backgroundNoiseLevel = 0;
    this.lastSpeechTime = null;
    this.consecutiveSpeechFrames = 0;
    this.silenceFrames = 0;
    this.lastPatternAlertTime = 0;
    this.lastVolumeFluctuationAlertTime = 0;
    this.lastPatternAnalysisTime = 0;
    
    // Thresholds (adjusted for Float32Array which has smaller values)
    // Current levels observed: RMS=0.0003, VoiceEnergy=0-2.5
    this.thresholds = {
      speechThreshold: 0.00025,      // Amplitude threshold for speech (adjusted to current mic levels)
      backgroundNoiseMax: 0.0002,   // Max acceptable background level
      multipleSpeakersThreshold: 0.15, // Frequency variation indicating multiple voices
      whisperDetectionThreshold: 0.0001, // Very low volume speech
      minSpeechDuration: 500,       // ms - minimum to consider as speech
      frequencyRangeHuman: [85, 255], // Hz - human voice range (simplified)
      suspiciousPatternWindow: 5000, // ms - window to analyze patterns
      warmupPeriod: 8000,           // 8 seconds warmup before alerting
      minSuspiciousDetections: 4,   // Need multiple detections before alerting
      alertCooldown: 15000,         // 15 seconds between alerts
      patternAlertCooldown: 60000,  // 60 seconds between pattern alerts
      volumeFluctuationCooldown: 30000, // 30 seconds between volume fluctuation alerts
      patternAnalysisInterval: 2000, // Only analyze patterns every 2 seconds
      minPatternIntervals: 6,
      patternVarianceThreshold: 50000,
      patternAvgIntervalMax: 1800,
      volumeFluctuationSensitivity: 0.03
    };
  }

  async initialize(audioStream, alertCallback) {
    try {
      this.alertCallback = alertCallback;
      this.startTime = Date.now();
      
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.3; // Reduced smoothing for faster response
      
      // Connect microphone with automatic gain control
      this.microphone = this.audioContext.createMediaStreamSource(audioStream);
      
      // Create gain node to boost microphone input (10x boost = +20dB)
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 10.0; // Strong boost to compensate for low mic volume
      
      // IMPORTANT: Connect gain to BOTH analyser AND destination for gain to work
      // Connect: microphone -> gain -> analyser
      //                        gain -> output (very quiet but not muted to keep processing active)
      this.microphone.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      
      // Connect to destination with very low volume to avoid feedback but keep processing active
      // Note: 0.0 breaks processing, 0.001 keeps it active but nearly silent
      const outputNode = this.audioContext.createGain();
      outputNode.gain.value = 0.001; // 0.1% volume - barely audible but keeps processing active
      this.gainNode.connect(outputNode);
      outputNode.connect(this.audioContext.destination);
      
      // Setup data array
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      if (this.debugEnabled) {
        console.log('🎤 Advanced Audio Detection initialized with 10x gain boost (+20dB) [0.1% output volume]');
      }
      return true;
    } catch (error) {
      console.error('Failed to initialize audio detection:', error);
      return false;
    }
  }

  startListening() {
    if (this.isListening || !this.analyser) return;
    
    this.isListening = true;
    this.analyzeAudio();
    if (this.debugEnabled) {
      console.log('🎤 Audio monitoring started');
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    if (this.debugEnabled) {
      console.log('🎤 Audio monitoring stopped');
    }
  }

  analyzeAudio() {
    if (!this.isListening) return;

    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Get time domain data as floats to capture actual amplified values from gain node
    const timeDomainData = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(timeDomainData);

    const now = Date.now();
    
    // Skip analysis during warmup period
    if (this.startTime && (now - this.startTime) < this.thresholds.warmupPeriod) {
      requestAnimationFrame(() => this.analyzeAudio());
      return;
    }
    
    // Log once when warmup completes
    if (this.startTime && (now - this.startTime) >= this.thresholds.warmupPeriod && (now - this.startTime) < (this.thresholds.warmupPeriod + 100)) {
      if (this.debugEnabled) {
        console.log('🎤 Audio detection warmup complete - now actively monitoring');
      }
    }
    
    // 1. Detect speech vs silence
    const speechResult = this.detectSpeech(this.dataArray, timeDomainData);
    
    // 2. Analyze frequency patterns for multiple speakers
    if (speechResult.isSpeech) {
      const multiSpeakerResult = this.detectMultipleSpeakers(this.dataArray);
      
      if (multiSpeakerResult.detected) {
        this.suspiciousAudioCount++;
        
        // Only alert after multiple detections and cooldown
        if (this.suspiciousAudioCount >= this.thresholds.minSuspiciousDetections &&
            (now - this.lastAlertTime) > this.thresholds.alertCooldown) {
          this.triggerAlert('MULTIPLE_SPEAKERS_DETECTED', 'critical', {
            confidence: multiSpeakerResult.confidence,
            message: 'Multiple voices detected - possible external help'
          });
          this.lastAlertTime = now;
          this.suspiciousAudioCount = 0;
        }
      }
      
      // 3. Detect whispering (common in cheating)
      const whisperResult = this.detectWhispering(this.dataArray, speechResult.volume);
      
      if (whisperResult.detected && (now - this.lastAlertTime) > this.thresholds.alertCooldown) {
        this.triggerAlert('WHISPERING_DETECTED', 'high', {
          volume: whisperResult.volume,
          message: 'Low-volume speech detected (whispering)'
        });
        this.lastAlertTime = now;
      }
      
      // 4. Pattern analysis for suspicious behavior
      this.speechHistory.push({
        time: now,
        volume: speechResult.volume,
        frequencies: this.extractFrequencyProfile(this.dataArray)
      });
      
      this.consecutiveSpeechFrames++;
      this.silenceFrames = 0;
    } else {
      this.silenceFrames++;
      this.consecutiveSpeechFrames = 0;
      // Reset suspicious count after silence
      if (this.silenceFrames > 10) {
        this.suspiciousAudioCount = 0;
      }
    }

    // Clean old history
    this.speechHistory = this.speechHistory.filter(
      s => now - s.time < this.thresholds.suspiciousPatternWindow
    );

    // 5. Analyze patterns (less frequently)
    if (this.speechHistory.length > 20) {
      this.analyzePatterns();
    }

    // Continue monitoring
    requestAnimationFrame(() => this.analyzeAudio());
  }

  detectSpeech(frequencyData, timeDomainData) {
    // Calculate RMS (Root Mean Square) volume from Float32Array (-1.0 to 1.0)
    let sum = 0;
    for (let i = 0; i < timeDomainData.length; i++) {
      sum += timeDomainData[i] * timeDomainData[i];
    }
    const rms = Math.sqrt(sum / timeDomainData.length);

    // Focus on human voice frequency range
    const voiceFrequencies = this.getVoiceFrequencies(frequencyData);
    const voiceEnergy = voiceFrequencies.reduce((a, b) => a + b, 0) / voiceFrequencies.length;

    const isSpeech = rms > this.thresholds.speechThreshold && voiceEnergy > 30;

    // Debug logging every 60 frames (~1 second)
    if (this.debugEnabled && Math.random() < 0.002) {
      console.log(`🎤 Audio levels: RMS=${rms.toFixed(4)}, VoiceEnergy=${voiceEnergy.toFixed(1)}, IsSpeech=${isSpeech}`);
    }

    return {
      isSpeech,
      volume: rms,
      voiceEnergy
    };
  }

  getVoiceFrequencies(frequencyData) {
    // Extract frequencies in human voice range (85-255 Hz roughly corresponds to bins)
    // Simplified mapping: bin 0 = 0 Hz, bin fftSize/2 = sampleRate/2
    const sampleRate = this.audioContext.sampleRate;
    const binSize = sampleRate / this.analyser.fftSize;
    
    const [minFreq, maxFreq] = this.thresholds.frequencyRangeHuman;
    const startBin = Math.floor(minFreq / binSize);
    const endBin = Math.ceil(maxFreq / binSize);
    
    return Array.from(frequencyData.slice(startBin, endBin));
  }

  detectMultipleSpeakers(frequencyData) {
    if (this.speechHistory.length < 5) {
      return { detected: false };
    }

    // Compare current frequency profile with recent history
    const currentProfile = this.extractFrequencyProfile(frequencyData);
    const recentProfiles = this.speechHistory.slice(-10).map(s => s.frequencies);

    // Calculate variance in frequency profiles
    let totalVariance = 0;
    for (let i = 0; i < currentProfile.length; i++) {
      const values = recentProfiles.map(p => p[i]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      totalVariance += variance;
    }

    const avgVariance = totalVariance / currentProfile.length;

    // High variance suggests different voice characteristics = multiple speakers
    if (avgVariance > this.thresholds.multipleSpeakersThreshold) {
      return {
        detected: true,
        confidence: Math.min(avgVariance / this.thresholds.multipleSpeakersThreshold, 1.0),
        variance: avgVariance
      };
    }

    return { detected: false };
  }

  extractFrequencyProfile(frequencyData) {
    // Create a simplified profile by grouping frequencies
    const groups = 8;
    const groupSize = Math.floor(frequencyData.length / groups);
    const profile = [];

    for (let i = 0; i < groups; i++) {
      const start = i * groupSize;
      const end = start + groupSize;
      const slice = Array.from(frequencyData.slice(start, end));
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      profile.push(avg / 255); // Normalize
    }

    return profile;
  }

  detectWhispering(frequencyData, volume) {
    // Whispering is low volume but still has voice frequencies
    const voiceFrequencies = this.getVoiceFrequencies(frequencyData);
    const hasVoicePattern = voiceFrequencies.some(v => v > 20);

    if (volume > this.thresholds.whisperDetectionThreshold && 
        volume < this.thresholds.speechThreshold && 
        hasVoicePattern) {
      return {
        detected: true,
        volume: volume.toFixed(4)
      };
    }

    return { detected: false };
  }

  analyzePatterns() {
    const now = Date.now();

    if ((now - this.lastPatternAnalysisTime) < this.thresholds.patternAnalysisInterval) {
      return;
    }

    this.lastPatternAnalysisTime = now;

    // Look for suspicious patterns like:
    // 1. Regular intervals of speech (someone reading answers)
    // 2. Short bursts of speech followed by silence (Q&A pattern)
    // 3. Sudden changes in volume/frequency (different speaker)

    if (this.speechHistory.length < 5) return;

    // Analyze speech intervals
    const intervals = [];
    for (let i = 1; i < this.speechHistory.length; i++) {
      const interval = this.speechHistory[i].time - this.speechHistory[i-1].time;
      if (interval < 2000) { // Within 2 seconds
        intervals.push(interval);
      }
    }

    if (intervals.length >= this.thresholds.minPatternIntervals) {
      // Check for regular pattern (suspicious)
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => 
        sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
      
      // Low variance = regular pattern = suspicious
      if (variance < this.thresholds.patternVarianceThreshold && avgInterval < this.thresholds.patternAvgIntervalMax &&
          (now - this.lastPatternAlertTime) > this.thresholds.patternAlertCooldown) {
        this.triggerAlert('SUSPICIOUS_SPEECH_PATTERN', 'high', {
          pattern: 'regular_intervals',
          avgInterval: Math.round(avgInterval),
          message: 'Regular speech pattern detected (possible Q&A exchange)'
        });
        this.lastPatternAlertTime = now;
      }
    }

    // Detect conversation-like pattern (alternating speakers)
    const volumeChanges = [];
    for (let i = 1; i < this.speechHistory.length; i++) {
      const change = Math.abs(this.speechHistory[i].volume - this.speechHistory[i-1].volume);
      volumeChanges.push(change);
    }

    const avgVolumeChange = volumeChanges.reduce((a, b) => a + b, 0) / volumeChanges.length;
  if (avgVolumeChange > this.thresholds.volumeFluctuationSensitivity &&
        (now - this.lastVolumeFluctuationAlertTime) > this.thresholds.volumeFluctuationCooldown) {
      this.triggerAlert('VOLUME_FLUCTUATION', 'medium', {
        change: avgVolumeChange.toFixed(4),
        message: 'Significant volume fluctuations (multiple speakers suspected)'
      });
      this.lastVolumeFluctuationAlertTime = now;
    }
  }

  triggerAlert(type, severity, data) {
    if (this.alertCallback) {
      this.alertCallback({
        type,
        timestamp: Date.now(),
        data: {
          ...data,
          severity // Include severity in data
        },
        warningLevel: this.calculateWarningLevel(severity)
      });
    }
    if (this.debugEnabled) {
      console.warn('🎤 Audio Alert:', type, data);
    }
  }

  calculateWarningLevel(severity) {
    if (severity === 'critical') return 3;
    if (severity === 'high') return 2;
    if (severity === 'medium') return 1;
    return 0;
  }

  reset() {
    this.speechHistory = [];
    this.lastSpeechTime = null;
    this.consecutiveSpeechFrames = 0;
    this.silenceFrames = 0;
  }
}

export default AudioDetection;
