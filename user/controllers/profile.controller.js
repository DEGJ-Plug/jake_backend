const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const cloudinary = require("../models/profile.model");

const updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    address,
    gender,
    location,
    businessName,
  } = req.body;
  const { userId } = req.user;
  try {
    let image;

    let [user, userProfile] = await Promise.all([
      User.findById(userId),
      Profile.findOne({ userId }),
    ]);

    if (user.role === "seller" || user.role === "logistics") {
      if (!location || !businessName || !address || !phoneNumber) {
        throw new Error(
          "location, businessName, address and phoneNumber are required!"
        );
      }
    }

    if (req.file) image = await cloudinary.uploader.upload(req.file.image);

    if (userProfile.avatar.publicId)
      await cloudinary.uploader.delete(userProfile.avatar.publicId);

    userProfile.avatar.image = image.secure_url;
    userProfile.avatar.publicId = image.public_id;

    userProfile.firstName = firstName || userProfile.firstName;
    userProfile.lastName = lastName || userProfile.lastName;
    userProfile.phoneNumber = phoneNumber || userProfile.phoneNumber;
    userProfile.address = address || userProfile.address;
    userProfile.gender = gender || userProfile.gender;
    userProfile.location = location || userProfile.location;
    userProfile.businessName = businessName || userProfile.businessName;

    await userProfile.save();
    return res
      .status(200)
      .json({ message: "Profile updated successfully", userProfile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = updateProfile;
