const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

const DEFAULT_FACE_MATCH_THRESHOLD = Number(process.env.FACE_MATCH_THRESHOLD || 0.48);

const formatUserResponse = (user, overrides = {}) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  hasReferenceFace: Boolean(user.referenceDescriptor && user.referenceDescriptor.length > 0),
  faceDescriptorEnrolled: Boolean(user.faceDescriptor && user.faceDescriptor.length > 0),
  isFaceVerified: Boolean(user.isFaceVerified),
  referenceDescriptor: user.referenceDescriptor || null,
  referencePhoto: user.referencePhoto || null,
  referenceUploadedAt: user.referenceUploadedAt || null,
  ...overrides
});

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, email, password, role });
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.enrollFace = async (req, res, next) => {
  const { descriptor } = req.body;

  if (!Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ message: 'Invalid face descriptor submitted' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { faceDescriptor: descriptor },
      { new: true }
    ).select('-password');
    res.json({
      message: 'Face descriptor enrolled',
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyFace = async (req, res, next) => {
  const { descriptor } = req.body;

  if (!Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ message: 'Invalid face descriptor submitted' });
  }

  try {
    const user = await User.findById(req.user._id).select('referenceDescriptor isFaceVerified');
    if (!user || !user.referenceDescriptor || user.referenceDescriptor.length === 0) {
      return res.status(400).json({ message: 'No reference face available. Contact an administrator.' });
    }

    const reference = user.referenceDescriptor;
    if (!Array.isArray(reference) || reference.length !== 128) {
      return res.status(500).json({ message: 'Stored reference descriptor is invalid.' });
    }

    const distance = Math.sqrt(
      descriptor.reduce((acc, value, index) => acc + (value - reference[index]) ** 2, 0)
    );

    if (Number.isNaN(distance)) {
      return res.status(400).json({ message: 'Unable to compute face distance.' });
    }

    if (distance > DEFAULT_FACE_MATCH_THRESHOLD) {
      return res.status(401).json({ message: 'Face verification failed', distance });
    }

    // Update user to mark face as verified
    user.isFaceVerified = true;
    user.faceDescriptor = descriptor; // Store the current descriptor as well
    await user.save();

    res.json({ message: 'Face verified successfully', distance, verified: true });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(formatUserResponse(user));
  } catch (error) {
    next(error);
  }
};
