import React, { useState, useEffect } from 'react';
import {
  getQuestionBanks,
  createQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
  shareQuestionBank
} from '../../services/questionBankService';
import Button from '../../components/ui/Button';

const QuestionBankManagement = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subject: '',
    tags: [],
    isPublic: false
  });

  useEffect(() => {
    fetchQuestionBanks();
  }, [filters]);

  const fetchQuestionBanks = async () => {
    try {
      setLoading(true);
      const response = await getQuestionBanks(filters);
      setBanks(response.data);
      setPagination(response.pagination);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load question banks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBank = async (e) => {
    e.preventDefault();
    try {
      await createQuestionBank(formData);
      setShowCreateModal(false);
      resetForm();
      fetchQuestionBanks();
    } catch (err) {
      setError(err.message || 'Failed to create question bank');
    }
  };

  const handleUpdateBank = async (bankId) => {
    try {
      await updateQuestionBank(bankId, formData);
      setShowCreateModal(false);
      resetForm();
      fetchQuestionBanks();
    } catch (err) {
      setError(err.message || 'Failed to update question bank');
    }
  };

  const handleDeleteBank = async (bankId) => {
    if (!window.confirm('Are you sure you want to delete this question bank?')) {
      return;
    }
    try {
      await deleteQuestionBank(bankId);
      fetchQuestionBanks();
    } catch (err) {
      setError(err.message || 'Failed to delete question bank');
    }
  };

  const openEditModal = (bank) => {
    setSelectedBank(bank);
    setFormData({
      name: bank.name,
      description: bank.description || '',
      category: bank.category || '',
      subject: bank.subject || '',
      tags: bank.tags || [],
      isPublic: bank.isPublic || false
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      subject: '',
      tags: [],
      isPublic: false
    });
    setSelectedBank(null);
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleCategoryFilter = (e) => {
    setFilters({ ...filters, category: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Question Bank Management</h1>
          <p className="mt-2 text-gray-600">
            Organize and manage your question collections
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filters and Actions */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search question banks..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
              <select
                value={filters.category}
                onChange={handleCategoryFilter}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Programming">Programming</option>
                <option value="Languages">Languages</option>
                <option value="History">History</option>
              </select>
            </div>

            {/* Create Button */}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="whitespace-nowrap"
            >
              + Create Bank
            </Button>
          </div>
        </div>

        {/* Question Banks Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading question banks...</p>
          </div>
        ) : banks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No question banks found</h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first question bank.
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="mt-4">
              Create Question Bank
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banks.map((bank) => (
                <div
                  key={bank._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  {/* Bank Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {bank.name}
                      </h3>
                      {bank.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                          {bank.category}
                        </span>
                      )}
                    </div>
                    {bank.isPublic && (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {bank.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {bank.description}
                    </p>
                  )}

                  {/* Statistics */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {bank.totalQuestions || 0}
                        </p>
                        <p className="text-xs text-gray-600">Questions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {bank.usageCount || 0}
                        </p>
                        <p className="text-xs text-gray-600">Times Used</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {bank.sharedWith?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Shared</p>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Breakdown */}
                  {bank.questionsByDifficulty && (
                    <div className="mb-4">
                      <div className="flex gap-2 text-xs">
                        {bank.questionsByDifficulty.easy > 0 && (
                          <span className={`px-2 py-1 rounded ${getDifficultyBadge('easy')}`}>
                            {bank.questionsByDifficulty.easy} Easy
                          </span>
                        )}
                        {bank.questionsByDifficulty.medium > 0 && (
                          <span className={`px-2 py-1 rounded ${getDifficultyBadge('medium')}`}>
                            {bank.questionsByDifficulty.medium} Medium
                          </span>
                        )}
                        {bank.questionsByDifficulty.hard > 0 && (
                          <span className={`px-2 py-1 rounded ${getDifficultyBadge('hard')}`}>
                            {bank.questionsByDifficulty.hard} Hard
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {bank.tags && bank.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {bank.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {bank.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{bank.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditModal(bank)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedBank(bank);
                        setShowShareModal(true);
                      }}
                      className="flex-1"
                    >
                      Share
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteBank(bank._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedBank ? 'Edit Question Bank' : 'Create Question Bank'}
                </h2>

                <form onSubmit={selectedBank ? (e) => { e.preventDefault(); handleUpdateBank(selectedBank._id); } : handleCreateBank}>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Advanced Calculus Questions"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe the purpose and content of this bank"
                      />
                    </div>

                    {/* Category and Subject */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Science">Science</option>
                          <option value="Programming">Programming</option>
                          <option value="Languages">Languages</option>
                          <option value="History">History</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., Calculus, Algebra"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags.join(', ')}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., derivatives, integrals, limits"
                      />
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                        Make this question bank public
                      </label>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="mt-6 flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedBank ? 'Update' : 'Create'} Bank
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBankManagement;
