import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient.js';

export const fetchQuizzes = createAsyncThunk('quizzes/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/api/quizzes');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to load quizzes' });
  }
});

export const fetchQuizById = createAsyncThunk('quizzes/fetchById', async (quizId, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(`/api/quizzes/${quizId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to load quiz' });
  }
});

export const createQuiz = createAsyncThunk('quizzes/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post('/api/quizzes', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to create quiz' });
  }
});

export const updateQuiz = createAsyncThunk('quizzes/update', async ({ quizId, payload }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put(`/api/quizzes/${quizId}`, payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to update quiz' });
  }
});

export const deleteQuiz = createAsyncThunk('quizzes/delete', async (quizId, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/api/quizzes/${quizId}`);
    return quizId;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to delete quiz' });
  }
});

export const toggleQuizPublishStatus = createAsyncThunk('quizzes/togglePublish', async ({ quizId, isPublished }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put(`/api/quizzes/${quizId}`, { isPublished });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to update quiz status' });
  }
});

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    items: [],
    current: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Unable to load quizzes';
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Unable to load quiz';
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.items = state.items.map((quiz) => (quiz._id === action.payload._id ? action.payload : quiz));
        if (state.current && state.current._id === action.payload._id) {
          state.current = action.payload;
        }
        state.error = null;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.error = action.payload?.message || 'Unable to update quiz';
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.items = state.items.filter((quiz) => quiz._id !== action.payload);
        if (state.current && state.current._id === action.payload) {
          state.current = null;
        }
        state.error = null;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.error = action.payload?.message || 'Unable to delete quiz';
      })
      .addCase(toggleQuizPublishStatus.fulfilled, (state, action) => {
        state.items = state.items.map((quiz) => (quiz._id === action.payload._id ? action.payload : quiz));
        if (state.current && state.current._id === action.payload._id) {
          state.current = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleQuizPublishStatus.rejected, (state, action) => {
        state.error = action.payload?.message || 'Unable to update quiz status';
      });
  }
});

export default quizSlice.reducer;
