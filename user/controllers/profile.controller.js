const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const cloudinary = require('../../utils/cloudinary');

const updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    address,
    gender,
    location,
    businessName,
    role,
  } = req.body;
  const { userId } = req.user;
  try {
    let avatar;

    const userProfile = await Profile.findOne({ userId });

    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path);

      if (userProfile.avatar.publicId) {
        await cloudinary.uploader.delete(userProfile.avatar.publicId);
      }
      avatar = {
        image: image.secure_url,
        publicId: image.public_id,
      };
    }
    userProfile.avatar = avatar || userProfile.avatar;
    userProfile.firstName = firstName || userProfile.firstName;
    userProfile.lastName = lastName || userProfile.lastName;
    userProfile.phoneNumber = phoneNumber || userProfile.phoneNumber;
    userProfile.address = address || userProfile.address;
    userProfile.gender = gender || userProfile.gender;
    userProfile.location = location || userProfile.location;
    userProfile.businessName = businessName || userProfile.businessName;

    await userProfile.save();
    // switching from buyer to seller
    const userAcc = await User.findOne({ _id: userId });
    userAcc.role = role || userAcc.role;
    await userAcc.save();
    return res
      .status(200)
      .json({ message: 'Profile updated successfully', userProfile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = updateProfile;
