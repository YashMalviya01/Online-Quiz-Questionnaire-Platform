import api from './api';

/**
 * Question Bank Service
 * Handles all API calls related to question banks
 */

/**
 * Get all question banks with optional filters
 */
export const getQuestionBanks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.tags) {
      if (Array.isArray(filters.tags)) {
        filters.tags.forEach(tag => params.append('tags', tag));
      } else {
        params.append('tags', filters.tags);
      }
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/question-banks?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single question bank by ID
 */
export const getQuestionBankById = async (bankId) => {
  try {
    const response = await api.get(`/question-banks/${bankId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new question bank
 */
export const createQuestionBank = async (bankData) => {
  try {
    const response = await api.post('/question-banks', bankData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update question bank
 */
export const updateQuestionBank = async (bankId, bankData) => {
  try {
    const response = await api.put(`/question-banks/${bankId}`, bankData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete question bank
 */
export const deleteQuestionBank = async (bankId) => {
  try {
    const response = await api.delete(`/question-banks/${bankId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add question to bank
 */
export const addQuestionToBank = async (bankId, questionId) => {
  try {
    const response = await api.post(`/question-banks/${bankId}/questions`, {
      questionId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove question from bank
 */
export const removeQuestionFromBank = async (bankId, questionId) => {
  try {
    const response = await api.delete(`/question-banks/${bankId}/questions/${questionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Share question bank with user
 */
export const shareQuestionBank = async (bankId, userId, permission) => {
  try {
    const response = await api.post(`/question-banks/${bankId}/share`, {
      userId,
      permission
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Unshare question bank
 */
export const unshareQuestionBank = async (bankId, userId) => {
  try {
    const response = await api.delete(`/question-banks/${bankId}/share/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question bank statistics
 */
export const getQuestionBankStatistics = async (bankId) => {
  try {
    const response = await api.get(`/question-banks/${bankId}/statistics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getQuestionBanks,
  getQuestionBankById,
  createQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
  addQuestionToBank,
  removeQuestionFromBank,
  shareQuestionBank,
  unshareQuestionBank,
  getQuestionBankStatistics
};
