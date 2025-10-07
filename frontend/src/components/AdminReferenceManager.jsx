import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import faceapi, { loadFaceApiModels } from '../utils/faceApiLoader.js';
import {
  fetchAdminUsers,
  resetUploadState,
  uploadReferenceFace
} from '../store/slices/adminSlice.js';
import { getUserId } from '../utils/idUtils.js';

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB
// CACHE BUST: Force new build hash - October 6, 2025

const formatDate = (value) => {
  if (!value) return '—';
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return value;
  }
};

const AdminReferenceManager = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [detectedDescriptor, setDetectedDescriptor] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [processingError, setProcessingError] = useState('');
  const [distanceComparison, setDistanceComparison] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);

  const { users, listStatus, listError, uploadStatus, uploadError, lastUpdatedUserId } = useSelector(
    (state) => state.admin
  );

  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((candidate) => getUserId(candidate) === selectedUserId) || null;
  }, [selectedUserId, users]);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm === '') {
      return;
    }
    const handler = setTimeout(() => {
      dispatch(fetchAdminUsers({ search: searchTerm }));
    }, 350);
    return () => clearTimeout(handler);
  }, [dispatch, searchTerm]);

  useEffect(() => {
    if (uploadStatus === 'succeeded' && lastUpdatedUserId) {
      dispatch(fetchAdminUsers({ search: searchTerm }));
      setProcessingStatus('success');
      setProcessingError('');
      setDetectedDescriptor(null);
      setDistanceComparison(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      dispatch(resetUploadState());
    }
  }, [dispatch, lastUpdatedUserId, searchTerm, uploadStatus]);

  const ensureModels = async () => {
    if (!modelsReady) {
      console.log('📦 Loading face-api models...');
      try {
        await loadFaceApiModels();
        setModelsReady(true);
        console.log('✅ Face-api models loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load face-api models:', error);
        throw new Error(`Failed to load face detection models: ${error.message}`);
      }
    }
  };

  const processImage = async (file) => {
    if (!file) return;
    if (!selectedUser) {
      setProcessingError('Select a student before uploading a photo.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setProcessingError('Photo is too large. Choose an image under 8MB.');
      return;
    }

    setProcessingStatus('processing');
    setProcessingError('');
    setDetectedDescriptor(null);
    setDistanceComparison(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result;
        setPhotoPreview(String(dataUrl));
        
        console.log('🔄 Ensuring models are loaded...');
        await ensureModels();
        
        console.log('🖼️ Fetching image element...');
        const imageElement = await faceapi.fetchImage(String(dataUrl));
        
        console.log('👤 Detecting faces...');
        const detections = await faceapi
          .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
          .withFaceLandmarks(true) // true = use tiny landmark model (required for descriptors)
          .withFaceDescriptors();

        console.log(`✅ Detection complete. Found ${detections?.length || 0} face(s)`);

        if (!detections || detections.length === 0) {
          setProcessingStatus('idle');
          setProcessingError('No face detected in the uploaded photo. Try a different image with better lighting.');
          return;
        }

        if (detections.length > 1) {
          setProcessingStatus('idle');
          setProcessingError('Multiple faces detected. Upload a photo containing only the student.');
          return;
        }

        const descriptor = detections[0].descriptor;
        const descriptorArray = Array.from(descriptor);
        setDetectedDescriptor({ raw: descriptorArray, dataUrl: String(dataUrl) });

        if (selectedUser?.referenceDescriptor) {
          const reference = new Float32Array(selectedUser.referenceDescriptor);
          const distance = faceapi.euclideanDistance(reference, new Float32Array(descriptorArray));
          setDistanceComparison(distance);
        }

        setProcessingStatus('ready');
      } catch (error) {
        setProcessingStatus('idle');
        setProcessingError(error?.message || 'Unable to analyze the photo. Please try again.');
      }
    };
    reader.onerror = () => {
      setProcessingStatus('idle');
      setProcessingError('Unable to read the file. Please choose a different image.');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedUser) {
      setProcessingError('Select a student before uploading a photo.');
      return;
    }
    if (!detectedDescriptor?.raw || !detectedDescriptor.dataUrl) {
      setProcessingError('Process a photo to generate a descriptor before saving.');
      return;
    }

    try {
      await dispatch(
        uploadReferenceFace({
          email: selectedUser.email,
          descriptor: detectedDescriptor.raw,
          photoData: detectedDescriptor.dataUrl
        })
      ).unwrap();
    } catch (error) {
      setProcessingStatus('idle');
      setProcessingError(error?.message || 'Failed to store the reference photo.');
    }
  };

  const referenceStatusBadge = (user) => {
    const baseStyle = {
      padding: '0.25rem 0.6rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem'
    };
    if (user.hasReferenceFace) {
      return (
        <span style={{ ...baseStyle, background: '#dcfce7', color: '#166534' }}>
          <span aria-hidden>●</span>
          Verified reference
        </span>
      );
    }
    return (
      <span style={{ ...baseStyle, background: '#fee2e2', color: '#b91c1c' }}>
        <span aria-hidden>●</span>
        Reference missing
      </span>
    );
  };

  return (
    <section className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Identity reference center</h2>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Upload administrator-approved photos to verify students before and during proctoring.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(260px, 1fr) 2fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="identity-search" style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>
              Search students
            </label>
            <input
              id="identity-search"
              type="search"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div
            style={{
              border: '1px solid rgba(148, 163, 184, 0.25)',
              borderRadius: '12px',
              overflow: 'hidden',
              maxHeight: 360,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '0.85rem', color: '#475569' }}>Students</strong>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {listStatus === 'loading' && <p style={{ padding: '1rem' }}>Loading students…</p>}
              {listStatus === 'failed' && (
                <p style={{ padding: '1rem', color: '#ef4444' }}>{listError || 'Unable to load students.'}</p>
              )}
              {listStatus === 'succeeded' && users.length === 0 && (
                <p style={{ padding: '1rem', color: '#94a3b8' }}>No students found. Try adjusting your search.</p>
              )}
              {listStatus === 'succeeded' && users.length > 0 && (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {users.map((user) => {
                    const userId = getUserId(user);
                    const active = userId && userId === selectedUserId;
                    return (
                      <li
                        key={userId || user.email}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: active ? '#eff6ff' : '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (userId) {
                              setSelectedUserId(userId);
                            }
                            setProcessingStatus('idle');
                            setProcessingError('');
                            setDetectedDescriptor(null);
                            setDistanceComparison(null);
                            setPhotoPreview('');
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            padding: '0.9rem 1rem',
                            textAlign: 'left',
                            gap: '0.35rem',
                            background: 'transparent',
                            border: 'none'
                          }}
                        >
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{user.username}</span>
                          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{user.email}</span>
                          {referenceStatusBadge(user)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid rgba(148, 163, 184, 0.25)', borderRadius: '12px', padding: '1.5rem' }}>
          {selectedUser ? (
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginTop: 0 }}>Selected student</h3>
                <p style={{ color: '#475569' }}>
                  {selectedUser.username}
                  <br />
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{selectedUser.email}</span>
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Current reference</p>
                  {selectedUser.referencePhoto ? (
                    <img
                      src={selectedUser.referencePhoto}
                      alt={`Reference for ${selectedUser.username}`}
                      style={{ width: '100%', maxWidth: 220, borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 220,
                        height: 160,
                        borderRadius: '12px',
                        border: '1px dashed #cbd5f5',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#94a3b8',
                        fontSize: '0.85rem'
                      }}
                    >
                      No reference uploaded
                    </div>
                  )}
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Last updated: {formatDate(selectedUser.referenceUploadedAt)}
                  </p>
                </div>
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>Upload new reference</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Use a well-lit, front-facing photo with the student alone. We'll automatically validate and extract the
                  biometric descriptor before storing it securely.
                </p>

                <label
                  htmlFor="reference-photo"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    border: '1px dashed #2563eb',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontWeight: 600,
                    marginBottom: '0.75rem'
                  }}
                >
                  Choose photo
                </label>
                <input
                  id="reference-photo"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(event) => processImage(event.target.files?.[0] || null)}
                />

                {photoPreview && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Detected preview</p>
                    <img
                      src={photoPreview}
                      alt="Uploaded preview"
                      style={{ width: '100%', maxWidth: 220, borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                  </div>
                )}

                {processingStatus === 'processing' && (
                  <p style={{ color: '#2563eb', marginTop: '0.75rem' }}>Analyzing face…</p>
                )}

                {processingError && (
                  <p style={{ color: '#ef4444', marginTop: '0.75rem' }} role="alert">
                    {processingError}
                  </p>
                )}

                {distanceComparison !== null && (
                  <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                    Distance from existing reference: <strong>{distanceComparison.toFixed(3)}</strong>
                  </p>
                )}

                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleUpload}
                  disabled={processingStatus !== 'ready' || uploadStatus === 'loading'}
                  style={{ marginTop: '1rem' }}
                >
                  {uploadStatus === 'loading' ? 'Saving…' : 'Save reference'}
                </button>

                {uploadError && (
                  <p style={{ color: '#ef4444', marginTop: '0.75rem' }} role="alert">
                    {uploadError}
                  </p>
                )}

                {processingStatus === 'success' && (
                  <p style={{ color: '#166534', marginTop: '0.75rem' }}>Reference updated successfully.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: '#94a3b8', minHeight: 180 }}>
              <p>Select a student to begin uploading a reference photo.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminReferenceManager;
