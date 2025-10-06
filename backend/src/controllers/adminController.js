const User = require('../models/User');

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  hasReferenceFace: Boolean(user.referenceDescriptor && user.referenceDescriptor.length > 0),
  referencePhoto: user.referencePhoto || null,
  referenceDescriptor: user.referenceDescriptor || null,
  referenceUploadedAt: user.referenceUploadedAt || null,
  isFaceVerified: Boolean(user.isFaceVerified)
});

exports.listUsers = async (req, res, next) => {
  const { search = '', role = 'student', limit = 50 } = req.query;
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));

  const query = {};
  if (role) {
    query.role = role;
  }

  if (search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ email: regex }, { username: regex }];
  }

  try {
    const users = await User.find(query)
      .sort({ username: 1 })
      .limit(safeLimit)
      .select('username email role referenceDescriptor referencePhoto referenceUploadedAt isFaceVerified');

    res.json({
      users: users.map((user) => sanitizeUser(user))
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadReferenceFace = async (req, res, next) => {
  const { email, descriptor, photoData } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ message: 'A valid 128-length descriptor array is required' });
  }

  if (typeof photoData !== 'string' || photoData.length === 0) {
    return res.status(400).json({ message: 'Photo data is required' });
  }

  const approxBytes = Buffer.byteLength(photoData, 'utf8');
  const maxBytes = Number(process.env.FACE_REFERENCE_MAX_BYTES || 8 * 1024 * 1024);
  if (approxBytes > maxBytes) {
    return res
      .status(413)
      .json({ message: `Photo is too large. Max allowed size is ${Math.round(maxBytes / 1024 / 1024)}MB.` });
  }

  try {
    const numericDescriptor = descriptor.map((value) => Number(value));
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        referenceDescriptor: numericDescriptor,
        referencePhoto: photoData,
        referenceUploadedAt: new Date(),
        isFaceVerified: false  // Reset verification status when new reference is uploaded
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Reference face stored successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};
