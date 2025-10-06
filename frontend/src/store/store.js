import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import quizReducer from './slices/quizSlice.js';
import resultReducer from './slices/resultSlice.js';
import adminReducer from './slices/adminSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
    results: resultReducer,
    admin: adminReducer
  }
});

export default store;
