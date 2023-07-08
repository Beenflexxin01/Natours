const crypto = require('crypto');

const mongoose = require('mongoose');

const validator = require('validator');

// const slugify = require('slugify');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'A user must have an active email address'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'The stated email string must be a valid email address',
    ],
  },

  photo: [String],

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'A user must have a unique password'],
    minlength: [8, 'A password must not be less than 8 characters'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    // required: [true, 'User must confirm password before proceeding'],
    validate: {
      // This way works on CREATE AND SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpired: Date,
  active: {
    type: Boolean,
    default: true,
    sekect: false,
  },
});
userSchema.pre('save', async function (next) {
  //   // ONLY FUN THIS FUNCTION IF THE PASSWORD WAS ACTUALLY MODIFIED
  if (!this.isModified('password')) return next();

  //   // Hashing the password using "Bcrypt" with a coast of 12 with asynchronous version....
  this.password = await bcrypt.hash(this.password, 12);

  // Deleting the PasswordConfirm field after validation
  // so as to hash the password...
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// QUERY MILLDEWARE
userSchema.pre(/^find/, function (next) {
  // this point to the current query.
  this.find({ active: { $ne: false } });

  next();
});

// INSTANCE METHOD
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changeTimeStamp;
  }
  // false means not changed
  return false;
};

// Password Reset
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
