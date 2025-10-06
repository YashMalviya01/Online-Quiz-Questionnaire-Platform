// Advanced Liveness Detection Engine
// Detects photos, videos, screens, and other spoofing attempts

class LivenessDetection {
  constructor() {
    this.blinkHistory = [];
    this.movementHistory = [];
    this.textureHistory = [];
    this.lastBlinkTime = null;
    this.consecutiveNoBlinkFrames = 0;
    this.alertCallback = null;
    this.startTime = null;
    this.suspiciousFrameCount = 0;
    this.lastAlertTime = 0;
    
    // Thresholds
    this.thresholds = {
      minBlinksPerMinute: 8,      // Natural blink rate: 15-20/min, we're lenient
      maxBlinksPerMinute: 40,     // Too many = artificial
      blinkDuration: [100, 400],  // Normal blink: 100-400ms
      minHeadMovement: 5,         // Pixels - real person naturally moves
      textureVariance: 0.02,      // Low variance = screen/photo
      microMovementThreshold: 2,  // Tiny natural movements
      noBlinkTimeout: 45000,      // 45 seconds without blink = suspicious
      screenDetectionScore: 0.7,  // Threshold for screen detection
      warmupPeriod: 10000,        // 10 seconds warmup before alerting
      minSuspiciousFrames: 5,     // Need 5 consecutive suspicious frames
      alertCooldown: 5000         // 5 seconds between alerts
    };
  }

  initialize(alertCallback) {
    this.alertCallback = alertCallback;
    this.startTime = Date.now();
    console.log('🔍 Liveness Detection initialized');
  }

  analyzeLiveness(detection, videoElement) {
    if (!detection || !videoElement) return;

    const now = Date.now();
    
    // Skip analysis during warmup period
    if (this.startTime && (now - this.startTime) < this.thresholds.warmupPeriod) {
      return { isLive: true, confidence: 1.0, warnings: [] };
    }

    const results = {
      isLive: true,
      confidence: 1.0,
      warnings: []
    };

    // Only run blink detection if landmarks are actually present
    if (detection.landmarks) {
      const blinkResult = this.analyzeBlinkPattern(detection);
      if (blinkResult.suspicious) {
        results.warnings.push(blinkResult.reason);
        results.confidence *= 0.7; // Less aggressive penalty
      }
    }

    // 2. Micro-movement Detection (real people have tiny involuntary movements)
    const movementResult = this.analyzeMicroMovements(detection);
    if (movementResult.suspicious) {
      results.warnings.push(movementResult.reason);
      results.confidence *= 0.8; // Less aggressive
    }

    // 3. Texture Analysis (screens have different texture patterns)
    const textureResult = this.analyzeTexture(detection, videoElement);
    if (textureResult.suspicious) {
      results.warnings.push(textureResult.reason);
      results.confidence *= 0.8; // Less aggressive
    }

    // 4. Depth/3D Analysis (photos are flat)
    const depthResult = this.analyzeDepth(detection);
    if (depthResult.suspicious) {
      results.warnings.push(depthResult.reason);
      results.confidence *= 0.8; // Less aggressive
    }

    // 5. Screen Detection (moiré patterns, refresh rate artifacts)
    const screenResult = this.detectScreen(detection, videoElement);
    if (screenResult.isScreen) {
      results.warnings.push('Screen/display detected');
      results.confidence *= 0.5;
    }

    // Count suspicious frames - need multiple consecutive frames before alerting
    if (results.confidence < 0.7) {
      this.suspiciousFrameCount++;
    } else {
      this.suspiciousFrameCount = 0; // Reset if confidence is good
    }

    // Only trigger alerts after seeing multiple suspicious frames AND respecting cooldown
    const timeSinceLastAlert = now - this.lastAlertTime;
    if (this.suspiciousFrameCount >= this.thresholds.minSuspiciousFrames && 
        timeSinceLastAlert > this.thresholds.alertCooldown) {
      
      if (results.confidence < 0.4) {
        this.triggerAlert('LIVENESS_CHECK_FAILED', 'critical', {
          confidence: results.confidence.toFixed(2),
          warnings: results.warnings,
          message: 'Possible photo/video spoof detected'
        });
        this.lastAlertTime = now;
      } else if (results.confidence < 0.7) {
        this.triggerAlert('LIVENESS_SUSPICIOUS', 'high', {
          confidence: results.confidence.toFixed(2),
          warnings: results.warnings
        });
        this.lastAlertTime = now;
      }
    }

    return results;
  }

  analyzeBlinkPattern(detection) {
    const landmarks = detection.landmarks;
    if (!landmarks) return { suspicious: false };

    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    // Calculate Eye Aspect Ratio (EAR)
    const leftEAR = this.calculateEAR(leftEye);
    const rightEAR = this.calculateEAR(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;

    const now = Date.now();
    const isBlink = avgEAR < 0.2; // Threshold for closed eyes

    if (isBlink && !this.lastBlinkTime) {
      this.lastBlinkTime = now;
    } else if (!isBlink && this.lastBlinkTime) {
      const blinkDuration = now - this.lastBlinkTime;
      this.blinkHistory.push({ time: now, duration: blinkDuration });
      this.lastBlinkTime = null;
      this.consecutiveNoBlinkFrames = 0;

      // Check if blink duration is natural
      if (blinkDuration < this.thresholds.blinkDuration[0] || 
          blinkDuration > this.thresholds.blinkDuration[1]) {
        return {
          suspicious: true,
          reason: `Unnatural blink duration: ${blinkDuration}ms`
        };
      }
    } else if (!isBlink) {
      this.consecutiveNoBlinkFrames++;
    }

    // Clean old blink history (keep last 60 seconds)
    this.blinkHistory = this.blinkHistory.filter(b => now - b.time < 60000);

    // Check blink rate
    const blinksPerMinute = this.blinkHistory.length;
    if (this.blinkHistory.length > 10) {
      if (blinksPerMinute < this.thresholds.minBlinksPerMinute) {
        return {
          suspicious: true,
          reason: `Too few blinks: ${blinksPerMinute}/min (photo/video suspected)`
        };
      }
      if (blinksPerMinute > this.thresholds.maxBlinksPerMinute) {
        return {
          suspicious: true,
          reason: `Too many blinks: ${blinksPerMinute}/min (artificial)`
        };
      }
    }

    // No blink for extended period
    const timeSinceLastBlink = this.blinkHistory.length > 0 
      ? now - this.blinkHistory[this.blinkHistory.length - 1].time 
      : Infinity;
    
    if (timeSinceLastBlink > this.thresholds.noBlinkTimeout) {
      return {
        suspicious: true,
        reason: 'No blinking detected for extended period (static image suspected)'
      };
    }

    return { suspicious: false };
  }

  calculateEAR(eyePoints) {
    // Eye Aspect Ratio calculation
    if (!eyePoints || eyePoints.length < 6) return 1;
    
    const v1 = this.distance(eyePoints[1], eyePoints[5]);
    const v2 = this.distance(eyePoints[2], eyePoints[4]);
    const h = this.distance(eyePoints[0], eyePoints[3]);
    
    return (v1 + v2) / (2 * h);
  }

  distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  analyzeMicroMovements(detection) {
    const box = detection.detection.box;
    const center = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
      time: Date.now()
    };

    this.movementHistory.push(center);
    this.movementHistory = this.movementHistory.filter(
      m => center.time - m.time < 5000 // Keep last 5 seconds
    );

    if (this.movementHistory.length < 20) {
      return { suspicious: false };
    }

    // Calculate movement variance
    const movements = [];
    for (let i = 1; i < this.movementHistory.length; i++) {
      const dx = this.movementHistory[i].x - this.movementHistory[i-1].x;
      const dy = this.movementHistory[i].y - this.movementHistory[i-1].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      movements.push(dist);
    }

    const avgMovement = movements.reduce((a, b) => a + b, 0) / movements.length;

    // Real person has natural micro-movements, static image/video has none
    if (avgMovement < this.thresholds.microMovementThreshold) {
      return {
        suspicious: true,
        reason: `Insufficient natural movement: ${avgMovement.toFixed(2)}px (static image suspected)`
      };
    }

    return { suspicious: false };
  }

  analyzeTexture(detection, videoElement) {
    // Simplified texture analysis using face region
    const box = detection.detection.box;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const sampleSize = 50;
    canvas.width = sampleSize;
    canvas.height = sampleSize;

    try {
      ctx.drawImage(
        videoElement,
        box.x, box.y, box.width, box.height,
        0, 0, sampleSize, sampleSize
      );

      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const variance = this.calculateVariance(imageData.data);

      this.textureHistory.push({ time: Date.now(), variance });
      this.textureHistory = this.textureHistory.filter(
        t => Date.now() - t.time < 3000
      );

      // Low variance = smooth/artificial (screen, photo)
      if (variance < this.thresholds.textureVariance) {
        return {
          suspicious: true,
          reason: `Low texture variance: ${variance.toFixed(4)} (screen/photo suspected)`
        };
      }
    } catch (error) {
      // Canvas security error - can't analyze
    }

    return { suspicious: false };
  }

  calculateVariance(pixels) {
    let sum = 0;
    let sumSq = 0;
    const count = pixels.length / 4;

    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
      sum += brightness;
      sumSq += brightness * brightness;
    }

    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);
    return variance / 65025; // Normalize to 0-1
  }

  analyzeDepth(detection) {
    // Use head pose to detect flat surfaces
    const landmarks = detection.landmarks;
    if (!landmarks) return { suspicious: false };

    const nose = landmarks.positions[30];
    const leftEye = this.getCenter(landmarks.getLeftEye());
    const rightEye = this.getCenter(landmarks.getRightEye());

    // Calculate perspective distortion (flatter in photos)
    const eyeDistance = this.distance(leftEye, rightEye);
    const noseToEyeDistance = (
      this.distance(nose, leftEye) + this.distance(nose, rightEye)
    ) / 2;

    const ratio = noseToEyeDistance / eyeDistance;

    // In real 3D faces, this ratio varies more with angle
    // In photos/screens, it remains more constant
    // This is a simplified check
    if (ratio < 0.3 || ratio > 2.0) {
      return {
        suspicious: true,
        reason: 'Unusual depth ratio (flat surface suspected)'
      };
    }

    return { suspicious: false };
  }

  getCenter(points) {
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return { x, y };
  }

  detectScreen(detection, videoElement) {
    // Detect moiré patterns and refresh rate artifacts from screens
    const box = detection.detection.box;
    
    // Check if face is too rectangular/perfect (screen edge detection)
    const aspectRatio = box.width / box.height;
    if (aspectRatio < 0.6 || aspectRatio > 1.4) {
      // Natural face aspect ratio is usually 0.75-1.2
      return {
        isScreen: true,
        confidence: 0.8,
        reason: 'Unusual aspect ratio (screen suspected)'
      };
    }

    // Check if face is too small (showing a device)
    if (videoElement.videoWidth > 0) {
      const relativeSize = box.width / videoElement.videoWidth;
      if (relativeSize < 0.15) {
        return {
          isScreen: true,
          confidence: 0.9,
          reason: 'Face too small (device screen suspected)'
        };
      }
    }

    return { isScreen: false };
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
    console.warn('⚠️ Liveness Alert:', type, data);
  }

  calculateWarningLevel(severity) {
    if (severity === 'critical') return 3;
    if (severity === 'high') return 2;
    if (severity === 'medium') return 1;
    return 0;
  }

  reset() {
    this.blinkHistory = [];
    this.movementHistory = [];
    this.textureHistory = [];
    this.lastBlinkTime = null;
    this.consecutiveNoBlinkFrames = 0;
  }
}

export default LivenessDetection;
