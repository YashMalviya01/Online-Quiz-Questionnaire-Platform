import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient.js';

export const startExam = createAsyncThunk('results/startExam', async (quizId, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/api/results/start', { quizId });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to start exam' });
  }
});

export const submitExam = createAsyncThunk(
  'results/submitExam',
  async ({ resultId, answers, score }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/api/results/${resultId}/submit`, {
        answers,
        score
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unable to submit exam' });
    }
  }
);

export const fetchResultsForUser = createAsyncThunk(
  'results/fetchForUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/api/results/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unable to load results' });
    }
  }
);

export const fetchResultDetail = createAsyncThunk(
  'results/fetchDetail',
  async (resultId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/api/results/${resultId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unable to load result' });
    }
  }
);

export const fetchAllResults = createAsyncThunk('results/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/api/results');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to load results' });
  }
});

const resultSlice = createSlice({
  name: 'results',
  initialState: {
    current: null,
    list: [],
    status: 'idle',
    error: null,
    listStatus: 'idle',
    listError: null
  },
  reducers: {
    resetCurrent(state) {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startExam.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startExam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(startExam.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Unable to start exam';
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchResultsForUser.fulfilled, (state, action) => {
        state.list = action.payload;
        state.listStatus = 'succeeded';
        state.listError = null;
      })
      .addCase(fetchResultsForUser.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchResultsForUser.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload?.message || 'Unable to load results';
      })
      .addCase(fetchAllResults.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchAllResults.fulfilled, (state, action) => {
        state.list = action.payload;
        state.listStatus = 'succeeded';
        state.listError = null;
      })
      .addCase(fetchAllResults.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload?.message || 'Unable to load results';
      })
      .addCase(fetchResultDetail.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchResultDetail.rejected, (state, action) => {
        state.error = action.payload?.message || 'Unable to load result';
      });
  }
});

export const { resetCurrent } = resultSlice.actions;
export default resultSlice.reducer;
