import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import faceapi, { loadFaceApiModels } from '../utils/faceApiLoader.js';
import { verifyFaceDescriptor } from '../store/slices/authSlice.js';

const FACE_MATCH_THRESHOLD = 0.48;

const FaceEnrollmentPage = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, verificationStatus, verificationError } = useSelector((state) => state.auth);
  const [status, setStatus] = useState('loading-models');
  const [error, setError] = useState('');
  const [consentGranted, setConsentGranted] = useState(false);
  const [permissionState, setPermissionState] = useState('prompt');
  const [distance, setDistance] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [matchMessage, setMatchMessage] = useState(null);

  const referenceDescriptor = useMemo(() => {
    if (!user?.referenceDescriptor) return null;
    return new Float32Array(user.referenceDescriptor);
  }, [user?.referenceDescriptor]);

  useEffect(() => {
    if (!user) return;
    if (user.isFaceVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('🔄 Loading face-api models...');
        await loadFaceApiModels();
        console.log('✅ Face-api models loaded successfully');
        setModelsLoaded(true);
        if (referenceDescriptor) {
          console.log('✅ Reference descriptor found, ready for enrollment');
          setStatus('awaiting-consent');
        } else {
          console.warn('⚠️ No reference descriptor found');
          setStatus('missing-reference');
          setError('No reference face is available. Ask an administrator to upload your photo before continuing.');
        }
      } catch (err) {
        console.error('❌ Failed to load face-api models:', err);
        setStatus('error');
        setError('Unable to load facial recognition models. Please refresh and try again.');
      }
    };
    init();
  }, [referenceDescriptor]);

  useEffect(() => {
    if (!navigator?.permissions?.query) {
      console.warn('⚠️ Permissions API not available in this browser');
      return undefined;
    }

    let cancelled = false;
    let permissionHandle;

    navigator.permissions
      .query({ name: 'camera' })
      .then((statusRef) => {
        if (cancelled) return;
        console.log('🔍 Camera permission state:', statusRef.state);
        permissionHandle = statusRef;
        const syncState = () => {
          setPermissionState(statusRef.state);
          console.log('🔄 Permission state changed to:', statusRef.state);
          if (statusRef.state === 'denied') {
            setConsentGranted(false);
            setStatus('permission-blocked');
            setError('Camera access is blocked for this site. Enable permissions in your browser settings.');
          }
        };
        syncState();
        const handler = () => syncState();
        if (statusRef.addEventListener) {
          statusRef.addEventListener('change', handler);
        } else {
          statusRef.onchange = handler;
        }
      })
      .catch((err) => {
        console.warn('⚠️ Failed to query camera permission:', err);
      });

    return () => {
      cancelled = true;
      if (permissionHandle?.removeEventListener) {
        permissionHandle.removeEventListener('change', () => {});
      } else if (permissionHandle) {
        permissionHandle.onchange = null;
      }
    };
  }, []);

  useEffect(() => () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const requestCamera = async () => {
    if (!modelsLoaded || !referenceDescriptor) {
      console.warn('⚠️ Camera request blocked:', { modelsLoaded, hasReference: !!referenceDescriptor });
      return;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      console.error('❌ getUserMedia is unavailable in this context');
      setStatus('error');
      setError('Camera access is not supported in this browser context. Use a modern browser and HTTPS connection.');
      return;
    }

    if (!window.isSecureContext && !['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname)) {
      console.warn('⚠️ Insecure context detected. getUserMedia requires HTTPS on remote devices.');
      setStatus('error');
      setError('Camera access requires a secure (https) connection when accessing from another device. Please reload over https.');
      return;
    }
    try {
      console.log('📸 Requesting camera access...');
      setStatus('requesting-permission');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        },
        audio: false
      });
      console.log('✅ Camera access granted!', stream);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (!canvasRef.current || !videoRef.current) return;
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          console.log('✅ Camera feed started:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        };
      }
      setStatus('ready');
      setError('');
      setMatchMessage({ status: 'pending', text: 'Camera ready. Align your face and press verify.' });
    } catch (err) {
      console.error('❌ Camera access failed:', err.name, err.message);
      setConsentGranted(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setStatus('permission-blocked');
        setError('Camera access was denied. Allow permissions in your browser and try again.');
      } else if (err?.name === 'NotFoundError') {
        setStatus('error');
        setError('No camera was detected. Connect a camera and retry.');
      } else {
        setStatus('error');
        setError(`Unable to access the camera: ${err.name}. Please retry.`);
      }
    }
  };

  const handleVerify = async () => {
    if (!videoRef.current || status !== 'ready' || !referenceDescriptor) {
      setError('Camera is not ready yet.');
      return;
    }

    setStatus('processing');
    setError('');
    setDistance(null);
    setMatchMessage(null);

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true) // true = use tiny landmark model (required for descriptor)
        .withFaceDescriptor();

      if (!detection) {
        setStatus('ready');
        setError('No face detected. Ensure your face is well-lit and centered.');
        setMatchMessage({ status: 'absent', text: 'No face detected. Ensure you are in frame and try again.' });
        return;
      }

      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      const calculatedDistance = faceapi.euclideanDistance(referenceDescriptor, detection.descriptor);
      setDistance(calculatedDistance);

      if (calculatedDistance > FACE_MATCH_THRESHOLD) {
        setStatus('ready');
        setError(`Face mismatch detected. Distance ${calculatedDistance.toFixed(3)} is above the allowed threshold.`);
        setMatchMessage({
          status: 'mismatch',
          text: `Distance ${calculatedDistance.toFixed(3)} exceeds the allowed threshold. Adjust lighting or positioning and retry.`
        });
        return;
      }

      await dispatch(verifyFaceDescriptor(Array.from(detection.descriptor))).unwrap();
      setStatus('success');
      setMatchMessage({
        status: 'success',
        text: `Identity confirmed! Match distance ${calculatedDistance.toFixed(3)} is within the approved threshold. Redirecting...`
      });
      
      // Small delay before navigation to show success message
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('❌ Verification error:', err);
      setStatus('ready');
      setError(err?.message || 'Verification failed. Please try again.');
      setMatchMessage({ status: 'error', text: err?.message || 'Verification failed. Please try again.' });
    }
  };

  if (!user) {
    return null;
  }

  // Show success/redirect state
  if (status === 'success') {
    return (
      <section className="card" style={{ maxWidth: 800, margin: '2rem auto', textAlign: 'center' }}>
        <h1>✅ Verification Successful!</h1>
        <p style={{ color: '#166534', fontSize: '1.1rem', marginTop: '1rem' }}>
          Your identity has been confirmed. Redirecting to dashboard...
        </p>
        <div style={{ marginTop: '2rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </section>
    );
  }

  if (!referenceDescriptor) {
    return (
      <section className="card" style={{ maxWidth: 800, margin: '2rem auto' }}>
        <h1>Face Verification</h1>
        <p style={{ color: '#ef4444' }}>No reference face is on file. Contact an administrator to upload your photo.</p>
      </section>
    );
  }

  const verifyButtonDisabled =
    status !== 'ready' || verificationStatus === 'loading' || !consentGranted || !referenceDescriptor;

  return (
    <section className="card" style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Face Verification</h1>
      <p style={{ color: '#64748b', maxWidth: 600 }}>
        Please verify your identity before starting proctored exams. The captured frame is used only for comparison with the
        administrator-approved reference photo.
      </p>
      {matchMessage && (
        <div
          style={{
            margin: '1rem 0',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.35)',
            background:
              matchMessage.status === 'success'
                ? '#dcfce7'
                : matchMessage.status === 'mismatch' || matchMessage.status === 'error'
                  ? '#fee2e2'
                  : matchMessage.status === 'absent'
                    ? '#fef9c3'
                    : '#f1f5f9',
            color:
              matchMessage.status === 'success'
                ? '#166534'
                : matchMessage.status === 'mismatch' || matchMessage.status === 'error'
                  ? '#b91c1c'
                  : matchMessage.status === 'absent'
                    ? '#92400e'
                    : '#0f172a'
          }}
          role="status"
        >
          {matchMessage.text}
        </div>
      )}
      <div className="grid two" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ width: '100%', borderRadius: '12px', background: '#0f172a0d', minHeight: 240 }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          {['awaiting-consent', 'permission-blocked', 'missing-reference'].includes(status) && (
            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setConsentGranted(true);
                  setError('');
                  requestCamera();
                }}
                disabled={status === 'missing-reference' || verificationStatus === 'loading' || !modelsLoaded}
              >
                {status === 'requesting-permission' ? 'Opening camera…' : 'Enable camera'}
              </button>
              {permissionState === 'denied' && (
                <p style={{ marginTop: '0.5rem', color: '#b91c1c' }}>
                  Camera permission is denied. Update site permissions and try again.
                </p>
              )}
            </div>
          )}
        </div>
        <div>
          <h3>Verification steps</h3>
          <ol style={{ color: '#475569', lineHeight: 1.6, paddingLeft: '1.2rem' }}>
            <li>Click “Enable camera” and allow access in the browser prompt.</li>
            <li>Look directly at the camera with even lighting.</li>
            <li>
              Press “Verify my identity” to begin the comparison. If you see a mismatch, adjust your lighting and try again.
            </li>
          </ol>
          {distance !== null && (
            <p style={{ color: '#0f172a', marginTop: '0.75rem' }}>
              Latest match distance: <strong>{distance.toFixed(3)}</strong> (threshold ≤ {FACE_MATCH_THRESHOLD})
            </p>
          )}
          {error && (
            <p style={{ color: '#ef4444', marginTop: '0.75rem' }} role="alert">
              {error}
            </p>
          )}
          {verificationError && (
            <p style={{ color: '#ef4444', marginTop: '0.75rem' }} role="alert">
              {verificationError}
            </p>
          )}
          <button
            type="button"
            className="primary-btn"
            onClick={handleVerify}
            disabled={verifyButtonDisabled}
            style={{ marginTop: '1rem' }}
          >
            {verificationStatus === 'loading' || status === 'processing' ? 'Verifying…' : 'Verify my identity'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaceEnrollmentPage;
