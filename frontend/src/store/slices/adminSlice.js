import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient.js';

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = buildQueryString({ role: 'student', limit: 100, ...params });
      const { data } = await apiClient.get(`/api/admin/users${query}`);
      return data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unable to load users' });
    }
  }
);

export const uploadReferenceFace = createAsyncThunk(
  'admin/uploadReferenceFace',
  async ({ email, descriptor, photoData }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/api/admin/users/reference-face', {
        email,
        descriptor,
        photoData
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to store reference face' });
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    listStatus: 'idle',
    listError: null,
    uploadStatus: 'idle',
    uploadError: null,
    lastUpdatedUserId: null
  },
  reducers: {
    resetUploadState(state) {
      state.uploadStatus = 'idle';
      state.uploadError = null;
      state.lastUpdatedUserId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload?.message || 'Unable to load users';
      })
      .addCase(uploadReferenceFace.pending, (state) => {
        state.uploadStatus = 'loading';
        state.uploadError = null;
        state.lastUpdatedUserId = null;
      })
      .addCase(uploadReferenceFace.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.uploadError = null;
        state.lastUpdatedUserId = action.payload?.id || null;
        if (action.payload?.id) {
          const existing = state.users.findIndex((user) => user.id === action.payload.id);
          if (existing >= 0) {
            state.users[existing] = action.payload;
          } else {
            state.users.push(action.payload);
          }
        }
      })
      .addCase(uploadReferenceFace.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload?.message || 'Failed to store reference face';
      });
  }
});

export const { resetUploadState } = adminSlice.actions;
export default adminSlice.reducer;
