const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student'
    },
    faceDescriptor: {
      type: [Number],
      default: undefined
    },
    referenceDescriptor: {
      type: [Number],
      default: undefined
    },
    isFaceVerified: {
      type: Boolean,
      default: false
    },
    referencePhoto: {
      type: String,
      default: null
    },
    referenceUploadedAt: {
      type: Date,
      default: null
    },
    // 2FA fields
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: null
    },
    backupCodes: {
      type: [String],
      default: []
    },
    // OAuth fields
    oauthProvider: {
      type: String,
      enum: ['local', 'google', 'microsoft'],
      default: 'local'
    },
    oauthId: {
      type: String,
      default: null
    },
    profilePicture: {
      type: String,
      default: null
    },
    // Email verification
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    // Password reset
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    // Last activity
    lastLogin: {
      type: Date,
      default: null
    },
    lastLoginIP: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
