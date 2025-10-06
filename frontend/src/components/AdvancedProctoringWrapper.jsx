import { useEffect, useRef, useState, useCallback } from 'react';
import faceapi from '../utils/faceApiLoader';
import ProctoringRuleEngine from '../utils/proctoringRuleEngine';
import { AlertTriangle, Eye, Mic, Monitor, Copy, Users, Shield } from 'lucide-react';

const AdvancedProctoringWrapper = ({ 
  resultId, 
  faceDescriptor, 
  children,
  onViolation,
  onRiskScoreUpdate 
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const ruleEngineRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const screensCountRef = useRef(window.screen?.isExtended ? 2 : 1);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [violations, setViolations] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [currentStatus, setCurrentStatus] = useState({
    faceDetected: false,
    audioDetected: false,
    fullscreen: false,
    tabFocused: true,
    multipleScreens: false,
    virtualMachine: false,
    copiedContent: false
  });

  // Initialize Rule Engine
  useEffect(() => {
    ruleEngineRef.current = new ProctoringRuleEngine({
      sendEvent: (payload) => {
        console.log('Proctoring Event:', payload);
        setViolations(prev => [...prev, payload]);
        if (onViolation) onViolation(payload);
      },
      onNotify: (payload) => {
        setRiskScore(payload.eventData.riskScore || 0);
        if (onRiskScoreUpdate) onRiskScoreUpdate(payload.eventData.riskScore);
      }
    });

    return () => {
      if (ruleEngineRef.current) {
        ruleEngineRef.current.reset();
      }
    };
  }, [onViolation, onRiskScoreUpdate]);

  // Initialize Camera and Audio Monitoring
  useEffect(() => {
    let mounted = true;

    const initializeMonitoring = async () => {
      try {
        // Request camera and microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup audio analysis
        setupAudioMonitoring(stream);

        // Start face detection
        startFaceDetection();

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize monitoring:', error);
        ruleEngineRef.current?.trigger(
          'camera_access_denied',
          'critical',
          { error: error.message }
        );
      }
    };

    initializeMonitoring();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Setup Audio Monitoring for background voices
  const setupAudioMonitoring = (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Monitor audio levels
      const checkAudioLevel = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;

        if (average > 30) { // Threshold for detecting voice
          setCurrentStatus(prev => ({ ...prev, audioDetected: true }));
          ruleEngineRef.current?.trigger(
            'background_audio_detected',
            'medium',
            { level: average.toFixed(2) },
            { cooldownMs: 10000 }
          );
        } else {
          setCurrentStatus(prev => ({ ...prev, audioDetected: false }));
        }
      };

      setInterval(checkAudioLevel, 1000);
    } catch (error) {
      console.error('Audio monitoring setup failed:', error);
    }
  };

  // Face Detection with Anti-Spoofing
  const startFaceDetection = async () => {
    if (!faceDescriptor || !videoRef.current) return;

    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/face-models');
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/face-models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/face-models');

      const labeled = new faceapi.LabeledFaceDescriptors(
        'authorized_user',
        [new Float32Array(faceDescriptor)]
      );
      const faceMatcher = new faceapi.FaceMatcher([labeled], 0.6);

      detectionIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.paused) return;

        try {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks(true) // true = use tiny landmark model (required for descriptors)
            .withFaceDescriptors();

          if (detections.length === 0) {
            // No face detected
            setCurrentStatus(prev => ({ ...prev, faceDetected: false }));
            ruleEngineRef.current?.trigger(
              'no_face_detected',
              'high',
              { timestamp: Date.now() },
              { cooldownMs: 3000 }
            );
          } else if (detections.length > 1) {
            // Multiple faces detected
            setCurrentStatus(prev => ({ ...prev, faceDetected: false }));
            ruleEngineRef.current?.trigger(
              'multiple_faces_detected',
              'critical',
              { count: detections.length },
              { cooldownMs: 2000 }
            );
          } else {
            // One face detected - verify identity
            const match = faceMatcher.findBestMatch(detections[0].descriptor);
            
            if (match.label === 'authorized_user' && match.distance < 0.6) {
              setCurrentStatus(prev => ({ ...prev, faceDetected: true }));
            } else {
              setCurrentStatus(prev => ({ ...prev, faceDetected: false }));
              ruleEngineRef.current?.trigger(
                'unauthorized_face_detected',
                'critical',
                { 
                  distance: match.distance.toFixed(3),
                  confidence: ((1 - match.distance) * 100).toFixed(1)
                },
                { cooldownMs: 3000 }
              );
            }
          }

          // Draw on canvas for visual feedback
          if (canvasRef.current) {
            const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
            const resized = faceapi.resizeResults(detections, dims);
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resized);
          }
        } catch (error) {
          console.error('Face detection error:', error);
        }
      }, 2000); // Check every 2 seconds
    } catch (error) {
      console.error('Failed to load face detection models:', error);
    }
  };

  // Tab Switching Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCurrentStatus(prev => ({ ...prev, tabFocused: false }));
        ruleEngineRef.current?.trigger(
          'tab_switched',
          'high',
          { timestamp: Date.now() }
        );
      } else {
        setCurrentStatus(prev => ({ ...prev, tabFocused: true }));
      }
    };

    const handleBlur = () => {
      setCurrentStatus(prev => ({ ...prev, tabFocused: false }));
      ruleEngineRef.current?.trigger(
        'window_focus_lost',
        'medium',
        { timestamp: Date.now() }
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Fullscreen Monitoring
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setCurrentStatus(prev => ({ ...prev, fullscreen: isFullscreen }));
      
      if (!isFullscreen) {
        ruleEngineRef.current?.trigger(
          'fullscreen_exited',
          'high',
          { timestamp: Date.now() }
        );
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Copy/Paste Detection
  useEffect(() => {
    const handleCopy = (e) => {
      setCurrentStatus(prev => ({ ...prev, copiedContent: true }));
      ruleEngineRef.current?.trigger(
        'content_copied',
        'medium',
        { 
          text: e.clipboardData?.getData('text')?.substring(0, 50) || 'N/A'
        }
      );
      setTimeout(() => {
        setCurrentStatus(prev => ({ ...prev, copiedContent: false }));
      }, 2000);
    };

    const handlePaste = (e) => {
      ruleEngineRef.current?.trigger(
        'content_pasted',
        'high',
        { 
          text: e.clipboardData?.getData('text')?.substring(0, 50) || 'N/A'
        }
      );
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCopy);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCopy);
    };
  }, []);

  // Multiple Screens Detection
  useEffect(() => {
    const checkScreens = () => {
      if (window.screen?.isExtended) {
        const screenCount = window.screen.isExtended ? 2 : 1;
        if (screenCount > 1 && screenCount !== screensCountRef.current) {
          setCurrentStatus(prev => ({ ...prev, multipleScreens: true }));
          ruleEngineRef.current?.trigger(
            'multiple_screens_detected',
            'high',
            { screenCount }
          );
        }
        screensCountRef.current = screenCount;
      }
    };

    const interval = setInterval(checkScreens, 5000);
    checkScreens(); // Initial check

    return () => clearInterval(interval);
  }, []);

  // Virtual Machine Detection
  useEffect(() => {
    const detectVirtualMachine = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const vmIndicators = [
        'virtualbox',
        'vmware',
        'qemu',
        'kvm',
        'hyperv',
        'parallels'
      ];

      const isVM = vmIndicators.some(indicator => userAgent.includes(indicator));
      
      // Additional checks
      const hasLowCores = navigator.hardwareConcurrency < 2;
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      
      if (isVM || (hasLowCores && hasLowMemory)) {
        setCurrentStatus(prev => ({ ...prev, virtualMachine: true }));
        ruleEngineRef.current?.trigger(
          'virtual_machine_detected',
          'critical',
          { 
            userAgent: userAgent.substring(0, 100),
            cores: navigator.hardwareConcurrency,
            memory: navigator.deviceMemory
          }
        );
      }
    };

    detectVirtualMachine();
  }, []);

  // Right-click and keyboard shortcuts prevention
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      ruleEngineRef.current?.trigger(
        'right_click_attempted',
        'low',
        { timestamp: Date.now() }
      );
    };

    const handleKeyDown = (e) => {
      // Prevent common shortcuts
      const forbidden = [
        (e.ctrlKey && e.key === 'c'), // Copy
        (e.ctrlKey && e.key === 'v'), // Paste
        (e.ctrlKey && e.key === 'x'), // Cut
        (e.ctrlKey && e.shiftKey && e.key === 'i'), // DevTools
        (e.ctrlKey && e.shiftKey && e.key === 'j'), // Console
        (e.ctrlKey && e.key === 'u'), // View Source
        (e.key === 'F12'), // DevTools
        (e.ctrlKey && e.key === 'p'), // Print
        (e.ctrlKey && e.key === 's'), // Save
      ];

      if (forbidden.some(Boolean)) {
        e.preventDefault();
        ruleEngineRef.current?.trigger(
          'forbidden_shortcut_attempted',
          'medium',
          { key: e.key, ctrl: e.ctrlKey, shift: e.shiftKey }
        );
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getRiskColor = () => {
    if (riskScore >= 80) return '#ef4444';
    if (riskScore >= 50) return '#f59e0b';
    if (riskScore >= 30) return '#eab308';
    return '#10b981';
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Proctoring Status Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        borderBottom: `3px solid ${getRiskColor()}`
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} />
            <span style={{ fontWeight: 'bold' }}>AI Proctoring Active</span>
          </div>

          {/* Status Indicators */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <StatusIndicator 
              icon={<Eye size={16} />}
              label="Face"
              active={currentStatus.faceDetected}
            />
            <StatusIndicator 
              icon={<Mic size={16} />}
              label="Audio"
              active={!currentStatus.audioDetected}
            />
            <StatusIndicator 
              icon={<Monitor size={16} />}
              label="Fullscreen"
              active={currentStatus.fullscreen}
            />
            <StatusIndicator 
              icon={<Users size={16} />}
              label="Single Screen"
              active={!currentStatus.multipleScreens}
            />
          </div>
        </div>

        {/* Risk Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Risk Score</div>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: getRiskColor()
            }}>
              {riskScore}%
            </div>
          </div>
          {violations.length > 0 && (
            <div style={{
              background: getRiskColor(),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={16} />
              <span>{violations.length} Violations</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Video and Canvas */}
      <div style={{ display: 'none' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline
          width="640"
          height="480"
        />
        <canvas ref={canvasRef} />
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: '4rem' }}>
        {children}
      </div>

      {/* Warning Overlay if risk is high */}
      {riskScore >= 80 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(239, 68, 68, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          color: 'white',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <AlertTriangle size={64} />
          <h1 style={{ fontSize: '2rem', marginTop: '1rem' }}>
            Quiz Terminated
          </h1>
          <p style={{ fontSize: '1.25rem', marginTop: '1rem', maxWidth: '600px' }}>
            Multiple violations detected. Your quiz has been terminated and the administrator will be notified.
          </p>
          <div style={{ marginTop: '2rem', fontSize: '1rem', opacity: 0.9 }}>
            Total Violations: {violations.length} | Risk Score: {riskScore}%
          </div>
        </div>
      )}
    </div>
  );
};

const StatusIndicator = ({ icon, label, active }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: active ? 1 : 0.5
  }}>
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: active ? '#10b981' : '#ef4444'
    }} />
    {icon}
    <span style={{ fontSize: '0.875rem' }}>{label}</span>
  </div>
);

export default AdvancedProctoringWrapper;
