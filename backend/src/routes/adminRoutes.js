const express = require('express');
const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post(
  '/users/reference-face',
  authenticate,
  authorizeRole('admin'),
  adminController.uploadReferenceFace
);

router.get('/users', authenticate, authorizeRole('admin'), adminController.listUsers);

module.exports = router;
