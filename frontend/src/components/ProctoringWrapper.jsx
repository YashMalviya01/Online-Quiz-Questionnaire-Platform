import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import faceapi, { loadFaceApiModels } from '../utils/faceApiLoader.js';
import ProctoringRuleEngine from '../utils/proctoringRuleEngine.js';
import MovementTrackingEngine from '../utils/movementTrackingEngine.js';
import LivenessDetection from '../utils/livenessDetection.js';
import AudioDetection from '../utils/audioDetection.js';
import { MicVAD } from '@ricky0123/vad';
import { resolveApiBase, resolveWsBase } from '../utils/resolveApiBase.js';

const computedApiBase = resolveApiBase();
const wsBase = resolveWsBase();

const ProctoringWrapper = ({ resultId, faceDescriptor, quizId, children }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const vadRef = useRef(null);
  const faceMatcherRef = useRef(null);
  const wsRef = useRef(null);
  const faceLoopRef = useRef(null);
  const overlayRef = useRef(null);
  const ruleEngineRef = useRef(null);
  const speechStartRef = useRef(null);
  const absenceStartRef = useRef(null);
  const detectorOptionsRef = useRef(null);
  const feedbackRef = useRef({ status: 'pending', message: 'Awaiting camera signal…' });
  const movementTrackerRef = useRef(null);
  const livenessDetectorRef = useRef(null);
  const audioDetectorRef = useRef(null);
  const [status, setStatus] = useState('awaiting-consent');
  const [recentEvents, setRecentEvents] = useState([]);
  const [notification, setNotification] = useState('');
  const [consentGranted, setConsentGranted] = useState(false);
  const [blockingReason, setBlockingReason] = useState('');
  const [permissionSnapshot, setPermissionSnapshot] = useState({ camera: 'prompt', microphone: 'prompt' });
  const [matchFeedback, setMatchFeedback] = useState({ status: 'pending', message: 'Awaiting camera signal…' });
  const [violationWarning, setViolationWarning] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const updateMatchFeedback = useCallback((nextFeedback) => {
    const current = feedbackRef.current;
    if (current.status !== nextFeedback.status || current.message !== nextFeedback.message) {
      feedbackRef.current = nextFeedback;
      setMatchFeedback(nextFeedback);
    }
  }, []);

  const sendEvent = useCallback((eventPayload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const timestamp = new Date().toISOString();
      wsRef.current.send(
        JSON.stringify({
          type: 'EVENT',
          payload: {
            ...eventPayload,
            timestamp
          }
        })
      );
      setRecentEvents((prev) => [{ ...eventPayload, timestamp }, ...prev.slice(0, 9)]);
    }
  }, []);

  const handleViolationDetected = useCallback(async (violation) => {
    if (!token) {
      console.warn('[Proctoring] Skipping violation report because auth token is unavailable.');
      return;
    }
    try {
      // Normalize violation type to snake_case lowercase for backend
      const violationType = violation.type.toLowerCase();
      
      // Convert numeric warningLevel to string severity
      const numericWarningLevel = typeof violation.warningLevel === 'number' 
        ? violation.warningLevel 
        : (violation.warningLevel === 'critical' ? 3 :
           violation.warningLevel === 'high' ? 2 :
           violation.warningLevel === 'medium' ? 1 : 0);
      
      // Extract severity - could be in violation.data.severity or inferred from violation metadata
      const severity = violation.data?.severity || 
                      (numericWarningLevel >= 3 ? 'critical' : 
                       numericWarningLevel === 2 ? 'high' : 
                       numericWarningLevel === 1 ? 'medium' : 'low');

      // Convert warningLevel to string for backend
      const warningLevelString = numericWarningLevel >= 3 ? 'critical' :
                                 numericWarningLevel === 2 ? 'high' :
                                 numericWarningLevel === 1 ? 'medium' : 'low';

      // Send violation to backend
      const response = await fetch(`${computedApiBase}/api/proctoring/violations/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quizId,
          attemptId: resultId,
          violationType,
          severity,
          warningLevel: warningLevelString,
          data: violation.data || {}
        })
      });

      if (response.status === 401) {
        console.warn('[Proctoring] Violation reporting returned 401. Prompting user to refresh session.');
        setNotification('Your session expired—refresh the page or sign in again to resume secure monitoring.');
        return;
      }

      if (!response.ok) {
        console.error('Failed to report violation:', await response.text());
      }

      // Show warning to student for medium/high/critical violations
      if (severity !== 'low') {
        setViolationWarning({
          type: violation.type,
          severity,
          message: violation.data?.message || 'Suspicious activity detected',
          warningLevel: violation.warningLevel || 1
        });
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => setViolationWarning(null), 5000);
      }

      // Also send to rule engine for consistency
      sendEvent({
        eventType: violation.type?.toUpperCase?.() || 'UNKNOWN',
        severity,
        data: violation.data
      });
    } catch (error) {
      console.error('Failed to report violation:', error);
    }
  }, [token, quizId, resultId, sendEvent]);

  const ruleEngine = useMemo(() => {
    const engine = new ProctoringRuleEngine({
      sendEvent,
      onNotify: (payload) => {
        setNotification(`${payload.eventType} detected (${payload.severity})`);
        setTimeout(() => setNotification(''), 4000);
      }
    });
    ruleEngineRef.current = engine;
    return engine;
  }, [sendEvent]);

  const connectWebSocket = useCallback(() => {
    if (!token || !resultId) {
      console.log('[WebSocket] Missing token or resultId');
      return;
    }
    console.log('[WebSocket] Connecting to:', `${wsBase}/ws/proctor`);
    const socket = new WebSocket(`${wsBase}/ws/proctor`);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log('[WebSocket] Connection opened, sending AUTH');
      socket.send(
        JSON.stringify({
          type: 'AUTH',
          token,
          resultId
        })
      );
      setStatus('monitoring');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[WebSocket] Received message:', data);
    };

    socket.onclose = (event) => {
      console.log('[WebSocket] Connection closed:', event.code, event.reason);
      setStatus('disconnected');
    };

    socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      setStatus('error');
    };
  }, [token, resultId]);

  const initializeStreams = useCallback(async () => {
    if (streamRef.current) {
      setStatus('monitoring');
      return;
    }
    try {
      setStatus('loading-models');
      await loadFaceApiModels();
      setStatus('requesting-permission');
      if (!navigator?.mediaDevices?.getUserMedia) {
        setBlockingReason(
          'Camera and microphone access are not available in this browser or connection. Use a supported, up-to-date browser over HTTPS or localhost.'
        );
        setStatus('permission-blocked');
        setConsentGranted(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          const canvas = overlayRef.current;
          if (canvas && videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            console.log('[Video] Metadata loaded, dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
            // Trigger re-render to start face detection
            setStatus('calibrating');
          }
        };
      }
      setStatus('calibrating');

      try {
        const vad = await MicVAD.new({
          onSpeechStart: () => {
            speechStartRef.current = Date.now();
          },
          onSpeechEnd: () => {
            if (speechStartRef.current) {
              const duration = Date.now() - speechStartRef.current;
              if (duration > 1500) {
                ruleEngine.trigger('VOICE_DETECTED', 'medium', { durationMs: duration });
              }
            }
            speechStartRef.current = null;
          }
        });
        vad.start();
        vadRef.current = vad;
      } catch (vadError) {
        // eslint-disable-next-line no-console
        console.warn('VAD unavailable', vadError);
      }

      connectWebSocket();

      // Initialize movement tracking engine
      if (!movementTrackerRef.current && videoRef.current && overlayRef.current) {
        movementTrackerRef.current = new MovementTrackingEngine();
        await movementTrackerRef.current.initialize(
          videoRef.current,
          overlayRef.current,
          handleViolationDetected
        );
        movementTrackerRef.current.startTracking();
      }

      // Initialize liveness detection
      if (!livenessDetectorRef.current) {
        livenessDetectorRef.current = new LivenessDetection();
        livenessDetectorRef.current.initialize(handleViolationDetected);
        console.log('🔍 Liveness detection enabled');
      }

      // Initialize audio detection
      if (!audioDetectorRef.current && stream) {
        audioDetectorRef.current = new AudioDetection();
        const audioInitialized = await audioDetectorRef.current.initialize(stream, handleViolationDetected);
        if (audioInitialized) {
          audioDetectorRef.current.startListening();
          console.log('🎤 Audio detection enabled');
        }
      }
    } catch (error) {
      setStatus('awaiting-consent');
      setConsentGranted(false);
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        setBlockingReason(
          'Camera and microphone permissions are blocked for this site. Click the padlock icon near the address bar and allow both camera and microphone before restarting the exam.'
        );
        setStatus('permission-blocked');
      } else if (error?.name === 'NotFoundError') {
        setBlockingReason('No camera or microphone was detected. Connect the required devices and try again.');
      } else if (error?.message?.toLowerCase().includes('secure context')) {
        setBlockingReason('Camera and microphone access require using HTTPS or localhost. Update the URL and reload the exam.');
        setStatus('permission-blocked');
      } else {
        setBlockingReason('Camera and microphone access is required to continue. Please allow the browser prompt and try again.');
      }
    }
  }, [connectWebSocket, ruleEngine]);

  useEffect(() => () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (vadRef.current) {
      vadRef.current.stop();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (movementTrackerRef.current) {
      movementTrackerRef.current.stopTracking();
    }
    if (livenessDetectorRef.current) {
      livenessDetectorRef.current.reset();
    }
    if (audioDetectorRef.current) {
      audioDetectorRef.current.stopListening();
    }
    clearInterval(faceLoopRef.current);
  }, []);

  useEffect(() => {
    if (!consentGranted) return;
    initializeStreams().catch(() => {});
  }, [consentGranted, initializeStreams]);

  useEffect(() => {
    if (!navigator?.permissions?.query) return undefined;

    const watched = [];
    let cancelled = false;

    const startWatch = async (name) => {
      try {
        const statusRef = await navigator.permissions.query({ name });
        if (cancelled) return;

        const sync = () => {
          if (cancelled) return;
          setPermissionSnapshot((prev) => ({ ...prev, [name]: statusRef.state }));
          if (statusRef.state === 'denied') {
            setConsentGranted(false);
            setStatus('permission-blocked');
            setBlockingReason(
              'Browser permissions for the camera or microphone are blocked. Update your site permissions, then restart proctoring.'
            );
          } else if (statusRef.state === 'granted' && status === 'permission-blocked') {
            setBlockingReason('');
            setStatus('awaiting-consent');
          }
        };

        const handler = () => sync();
        sync();
        if (statusRef.addEventListener) {
          statusRef.addEventListener('change', handler);
        } else {
          statusRef.onchange = handler;
        }

        watched.push({ statusRef, handler });
      } catch (error) {
        // No-op when permissions API is unavailable for the given name
      }
    };

    ['camera', 'microphone'].forEach((permissionName) => startWatch(permissionName));

    return () => {
      cancelled = true;
      watched.forEach(({ statusRef, handler }) => {
        if (statusRef.removeEventListener) {
          statusRef.removeEventListener('change', handler);
        } else {
          statusRef.onchange = null;
        }
      });
    };
  }, [status]);

  useEffect(() => {
    if (!faceDescriptor) {
      console.log('[Face Detection] No faceDescriptor available');
      return undefined;
    }

    if (!videoRef.current || !videoRef.current.videoWidth) {
      console.log('[Face Detection] Video not ready - videoRef:', !!videoRef.current, 'videoWidth:', videoRef.current?.videoWidth);
      return undefined;
    }

    const FACE_MATCH_THRESHOLD = 0.48;
    const ABSENCE_THRESHOLD_MS = 3000;
    const MULTI_FACE_COOLDOWN_MS = 15000;
    const SPOOF_RISK_COOLDOWN_MS = 12000;

    if (!detectorOptionsRef.current) {
      // Lower scoreThreshold to detect faces more easily (including tablet screens)
      detectorOptionsRef.current = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 });
      console.log('[Face Detection] Initialized with scoreThreshold: 0.3');
    }

    console.log('[Face Detection] Creating face matcher with descriptor length:', faceDescriptor.length);
    const labeled = new faceapi.LabeledFaceDescriptors('candidate', [new Float32Array(faceDescriptor)]);
    faceMatcherRef.current = new faceapi.FaceMatcher([labeled], FACE_MATCH_THRESHOLD);
    console.log('[Face Detection] Face matcher created successfully');

    const runLoop = async () => {
      if (!videoRef.current || !faceMatcherRef.current) {
        console.log('[Face Detection] Missing refs - video:', !!videoRef.current, 'matcher:', !!faceMatcherRef.current);
        return;
      }

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, detectorOptionsRef.current)
          .withFaceLandmarks(true) // true = use tiny landmark model (required for descriptors)
          .withFaceDescriptors();

        console.log(`[Face Detection] Found ${detections?.length || 0} face(s)`);

        const now = Date.now();

        // Run liveness detection if face is detected
        if (detections && detections.length > 0 && livenessDetectorRef.current) {
          const livenessResult = livenessDetectorRef.current.analyzeLiveness(detections[0], videoRef.current);
          if (livenessResult && !livenessResult.isLive) {
            console.warn('⚠️ Liveness check failed:', livenessResult);
          }
        }

      if (!detections || detections.length === 0) {
        const canvas = overlayRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (!absenceStartRef.current) {
          absenceStartRef.current = now;
        }
        if (now - absenceStartRef.current > ABSENCE_THRESHOLD_MS) {
          ruleEngine.trigger('FACE_NOT_DETECTED', 'medium', { durationMs: now - absenceStartRef.current });
        }
        updateMatchFeedback({ status: 'absent', message: 'No face detected. Please stay visible.' });
        return;
      }

      absenceStartRef.current = null;

      if (detections.length > 1) {
        ruleEngine.trigger(
          'MULTIPLE_FACES_DETECTED',
          'high',
          { faceCount: detections.length },
          { cooldownMs: MULTI_FACE_COOLDOWN_MS }
        );
        updateMatchFeedback({
          status: 'multiple',
          message: 'More than one face detected. Only the verified student should be visible.'
        });
      }

      const evaluations = detections.map((detection) => ({
        detection,
        match: faceMatcherRef.current.findBestMatch(detection.descriptor)
      }));

      const videoElement = videoRef.current;
      const canvas = overlayRef.current;
      if (canvas && videoElement && videoElement.videoWidth && videoElement.videoHeight) {
        if (canvas.width !== videoElement.videoWidth || canvas.height !== videoElement.videoHeight) {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        evaluations.forEach((entry) => {
          const box = entry.detection.detection?.box;
          if (!box) return;
          const isCandidate = entry.match.label === 'candidate';
          const isMatch = isCandidate && entry.match.distance <= FACE_MATCH_THRESHOLD;
          const color = isMatch ? '#22c55e' : '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeStyle = color;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = color;
          ctx.fillRect(box.x, box.y, box.width, box.height);
          ctx.globalAlpha = 1;
          ctx.font = '16px "Inter", system-ui, sans-serif';
          ctx.fillStyle = color;
          const label = isCandidate
            ? `You (${entry.match.distance.toFixed(3)})`
            : `Extra face (${entry.match.distance.toFixed(3)})`;
          ctx.fillText(label, box.x + 4, Math.max(18, box.y - 6));
        });
      }

      const candidateMatch = evaluations.find((entry) => entry.match.label === 'candidate');
      const closestMatch = evaluations.reduce((best, entry) => {
        if (!best) return entry;
        return entry.match.distance < best.match.distance ? entry : best;
      }, null);

      if (!candidateMatch) {
        if (closestMatch?.match) {
          ruleEngine.trigger('FACE_MISMATCH', 'high', { distance: Number(closestMatch.match.distance.toFixed(3)) });
          const box = closestMatch.detection?.detection?.box;
          if (videoRef.current?.videoWidth && box?.width) {
            const relativeWidth = box.width / videoRef.current.videoWidth;
            if (relativeWidth < 0.18) {
              ruleEngine.trigger(
                'SPOOF_RISK_DETECTED',
                'medium',
                { reason: 'face_too_small', relativeWidth: Number(relativeWidth.toFixed(3)) },
                { cooldownMs: SPOOF_RISK_COOLDOWN_MS }
              );
            }
          }
        } else {
          ruleEngine.trigger('FACE_MISMATCH', 'high', {});
        }
        updateMatchFeedback({
          status: 'mismatch',
          message: 'Face does not match the approved reference. Please adjust and try again.'
        });
        return;
      }

      const otherFace = evaluations.find((entry) => entry !== candidateMatch);
      if (otherFace) {
        ruleEngine.trigger(
          'SECONDARY_FACE_PRESENT',
          'medium',
          { closestDistance: Number(otherFace.match.distance.toFixed(3)) },
          { cooldownMs: MULTI_FACE_COOLDOWN_MS }
        );
      }

      if (candidateMatch.match.distance > FACE_MATCH_THRESHOLD) {
        ruleEngine.trigger('FACE_MISMATCH', 'medium', {
          distance: Number(candidateMatch.match.distance.toFixed(3))
        });
        updateMatchFeedback({
          status: 'mismatch',
          message: `Face detected but distance ${candidateMatch.match.distance.toFixed(3)} exceeds the threshold.`
        });
      } else if (otherFace) {
        updateMatchFeedback({
          status: 'multiple',
          message: 'Additional face detected alongside the verified student.'
        });
      } else {
        updateMatchFeedback({
          status: 'match',
          message: `Identity confirmed (distance ${candidateMatch.match.distance.toFixed(3)}).`
        });
      }
      } catch (error) {
        console.error('[Face Detection] Error in runLoop:', error);
        updateMatchFeedback({ status: 'error', message: 'Face detection error. Check console.' });
      }
    };

    runLoop();
    faceLoopRef.current = setInterval(runLoop, 750);

    return () => clearInterval(faceLoopRef.current);
  }, [faceDescriptor, ruleEngine, updateMatchFeedback, status]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        ruleEngine.trigger('TAB_SWITCH', 'medium', {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [ruleEngine]);

  useEffect(() => {
    const detectMultiMonitor = async () => {
      if (window.getScreenDetails) {
        try {
          const details = await window.getScreenDetails();
          if (details.screens.length > 1) {
            ruleEngine.trigger(
              'MULTI_MONITOR_DETECTED',
              'high',
              { detectionMethod: 'WindowManagementAPI', screens: details.screens.length },
              { cooldownMs: 60000 }
            );
          }
        } catch (error) {
          // permission denied; fall back to heuristics
        }
      } else {
        const isExtended = window.screen?.isExtended;
        const suspiciousCoords = window.screenX < 0 || window.screenY < 0 || window.screenX > window.screen.width;
        if (isExtended || suspiciousCoords) {
          ruleEngine.trigger(
            'MULTI_MONITOR_DETECTED',
            'medium',
            { detectionMethod: 'Heuristic', isExtended, suspiciousCoords },
            { cooldownMs: 60000 }
          );
        }
      }
    };

    detectMultiMonitor();
  }, [ruleEngine]);

  if (!consentGranted) {
    return (
      <section className="card" style={{ maxWidth: 760, margin: '1rem auto' }}>
        <h2>Enable secure proctoring</h2>
        <p style={{ color: '#475569', lineHeight: 1.6 }}>
          To protect exam integrity, we need temporary access to your camera and microphone. Analysis happens locally in
          your browser; only anonymized alerts are sent to the server. You can revoke access at any time by leaving the
          exam or disabling permissions in your browser settings.
        </p>
        <ul style={{ color: '#475569', lineHeight: 1.6 }}>
          <li>Camera: verifies your identity and confirms you stay present.</li>
          <li>Microphone: detects sustained speech that may indicate assistance.</li>
          <li>System checks: monitor tab switches and multi-monitor setups.</li>
        </ul>
        {notification && <p style={{ color: '#ef4444' }}>{notification}</p>}
        {blockingReason && (
          <div
            role="alert"
            style={{
              margin: '1rem 0',
              padding: '1rem',
              borderRadius: '12px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#b91c1c'
            }}
          >
            <strong>Camera &amp; microphone access is blocked.</strong>
            <p style={{ marginTop: '0.5rem', color: '#7f1d1d' }}>{blockingReason}</p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#b91c1c' }}>
              <li>Chrome: select the padlock icon → Site settings → Allow Camera &amp; Microphone.</li>
              <li>Edge: select the padlock icon → Permissions → Reset permissions, then allow the prompt.</li>
              <li>Safari: go to Settings &gt; Websites and enable camera &amp; microphone for this site.</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>
              Current status — camera: {permissionSnapshot.camera}, microphone: {permissionSnapshot.microphone}
            </p>
          </div>
        )}
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            setNotification('');
            setBlockingReason('');
            setConsentGranted(true);
          }}
        >
          I consent and start proctoring
        </button>
      </section>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {violationWarning && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            maxWidth: '400px',
            padding: '1.5rem',
            borderRadius: '12px',
            background: violationWarning.severity === 'critical' ? '#7f1d1d' : violationWarning.severity === 'high' ? '#991b1b' : '#b91c1c',
            color: '#fff',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            zIndex: 9999,
            border: '2px solid rgba(255,255,255,0.2)',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>⚠️ Proctoring Alert</h4>
            <button
              onClick={() => setViolationWarning(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.95 }}>
            <strong>{violationWarning.type.replace(/_/g, ' ').toUpperCase()}</strong>
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
            {violationWarning.message}
          </p>
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.85rem' }}>
            <strong>Warning Level:</strong> {violationWarning.warningLevel}/3<br />
            <strong>Severity:</strong> {violationWarning.severity.toUpperCase()}
          </div>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
            Please maintain proper exam conduct. Repeated violations may result in disqualification.
          </p>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ width: 280, borderRadius: '16px', boxShadow: '0 10px 30px rgba(15,23,42,0.25)' }}
          />
          <canvas
            ref={overlayRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              pointerEvents: 'none'
            }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '0.75rem',
              background: '#0f172a',
              color: '#fff',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem'
            }}
          >
            {status}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Live proctoring</h3>
          <p style={{ color: '#64748b' }}>
            Your camera, microphone, and system signals are analyzed locally. Only anonymized alerts are sent to the
            server.
          </p>
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background:
                matchFeedback.status === 'match'
                  ? '#dcfce7'
                  : matchFeedback.status === 'mismatch' || matchFeedback.status === 'multiple'
                    ? '#fee2e2'
                    : '#f1f5f9',
              color:
                matchFeedback.status === 'match'
                  ? '#166534'
                  : matchFeedback.status === 'mismatch' || matchFeedback.status === 'multiple'
                    ? '#b91c1c'
                    : '#0f172a'
            }}
            role="status"
          >
            {matchFeedback.message}
          </div>
          {notification && <p style={{ color: '#ef4444' }}>{notification}</p>}
          <div>
            <h4>Recent events</h4>
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: 120, overflowY: 'auto' }}>
              {recentEvents.map((event) => (
                <li key={event.timestamp + event.eventType} style={{ fontSize: '0.85rem', color: '#475569' }}>
                  <strong>{event.eventType}</strong> ({event.severity}) — {event.timestamp}
                </li>
              ))}
              {recentEvents.length === 0 && <li style={{ color: '#94a3b8' }}>No alerts logged.</li>}
            </ul>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ProctoringWrapper;
