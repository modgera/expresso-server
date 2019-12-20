const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  cellNumber: {
    type: Number,
    required: [true, 'Please add a phone number'],
    unique: true,
    trim: true,
    maxLength: [15, 'Cell number can not be more than 15 digits'],
  },

  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },

  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: false,
    trim: true,
    maxLength: [50, 'Name can not be more than 50 characters'],
  },

  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },

  registrationDate: {
    type: Date,
    default: Date.now,
  },

  birthday: Date,

  bonusesAmount: Number,

  cellNumberVerified: {
    type: Boolean,
    default: false,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  deliveryAddresses: [
    {
      name: String,
      city: String,
      street: String,
      house: String,
      flat: String,
      exitNumber: String,
      floor: Number,
      intercom: Boolean,
      comments: String,
    },
  ],

  role: {
    type: String,
    enum: ['customer', 'admin', 'manager'],
    default: 'customer',
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verifyCellNumberToken: String,
  verifyCellNumberExpire: Date,
  verifyEmailToken: String,
  verifyEmailExpire: Date,
});

const encryptPassword = async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
};
UserSchema.pre('save', encryptPassword);

UserSchema.methods.getToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
