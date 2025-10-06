import * as faceapi from 'face-api.js';

let loaded = false;

const resolveModelBaseUrl = () => {
  const base = import.meta.env.BASE_URL || '/';
  const normalised = base.endsWith('/') ? base : `${base}/`;
  return `${normalised}face-models`;
};

export const loadFaceApiModels = async () => {
  if (loaded) return;
  const modelBaseUrl = resolveModelBaseUrl();
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelBaseUrl),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelBaseUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelBaseUrl)
    ]);
    loaded = true;
  } catch (error) {
    loaded = false;
    error.message = `Failed to load face-api models from ${modelBaseUrl}. ${error.message || ''}`;
    throw error;
  }
};

export default faceapi;
