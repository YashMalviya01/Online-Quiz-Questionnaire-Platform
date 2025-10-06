import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient, { setAuthToken } from '../../services/apiClient.js';

const tokenKey = 'qp_token';

const storedToken = localStorage.getItem(tokenKey);
if (storedToken) {
  setAuthToken(storedToken);
}

const normalizeUserPayload = (userPayload = {}) => ({
  ...userPayload,
  faceDescriptor: userPayload.referenceDescriptor || null,
  hasReferenceFace: Boolean(userPayload.hasReferenceFace || userPayload.referenceDescriptor),
  referenceDescriptor: userPayload.referenceDescriptor || null
});

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/api/auth/register', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Registration failed' });
  }
});

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/api/auth/login', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Login failed' });
  }
});

export const loadProfile = createAsyncThunk('auth/loadProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/api/auth/me');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to load profile' });
  }
});

export const verifyFaceDescriptor = createAsyncThunk(
  'auth/verifyFace',
  async (descriptor, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/api/auth/verify-face', { descriptor });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Face verification failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: storedToken || null,
    status: 'idle',
    error: null,
    verificationStatus: 'idle',
    verificationError: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(tokenKey);
      setAuthToken(null);
      state.verificationStatus = 'idle';
      state.verificationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...normalizeUserPayload(action.payload.user), isFaceVerified: false };
        state.token = action.payload.token;
        localStorage.setItem(tokenKey, action.payload.token);
        setAuthToken(action.payload.token);
        state.verificationStatus = 'idle';
        state.verificationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...normalizeUserPayload(action.payload.user), isFaceVerified: false };
        state.token = action.payload.token;
        localStorage.setItem(tokenKey, action.payload.token);
        setAuthToken(action.payload.token);
        state.verificationStatus = 'idle';
        state.verificationError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(loadProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const wasVerified = state.user?.isFaceVerified ?? false;
        const normalized = normalizeUserPayload(action.payload);
        state.user = {
          ...state.user,
          ...normalized,
          isFaceVerified: wasVerified && Boolean(normalized.hasReferenceFace)
        };
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Unable to load profile';
      })
      .addCase(verifyFaceDescriptor.pending, (state) => {
        state.verificationStatus = 'loading';
        state.verificationError = null;
      })
      .addCase(verifyFaceDescriptor.fulfilled, (state) => {
        state.verificationStatus = 'succeeded';
        state.verificationError = null;
        if (state.user) {
          state.user.isFaceVerified = true;
        }
      })
      .addCase(verifyFaceDescriptor.rejected, (state, action) => {
        state.verificationStatus = 'failed';
        state.verificationError = action.payload?.message || 'Face verification failed';
        if (state.user) {
          state.user.isFaceVerified = false;
        }
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
