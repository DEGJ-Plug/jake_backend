const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  publicId: {
    type: String,
  },
});

const profileSchema = new mongoose.Schema(
  {
    avatar: {
      type: [avatarSchema],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    location: {
      type: String,
    },
    businessName: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
