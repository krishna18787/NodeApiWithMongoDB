const Profile = require('../models/Profile');
const cloudinary = require('../config/cloudinary');

function uploadToCloudinary(fileBuffer, originalname) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'npm-server/profile-images',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

async function getProfile(req, res) {
  try {
    const profile = await Profile.findOne().sort({ updatedAt: -1 });

    if (!profile) {
      return res.status(404).json({ error: 'profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProfileHistory(req, res) {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function uploadProfile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'image file is required' });
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const profile = await Profile.create({
      name: req.body.name || 'User',
      imageUrl: uploadResult.secure_url,
      imageFilename: uploadResult.original_filename || req.file.originalname,
      imagePublicId: uploadResult.public_id,
      imageMimeType: req.file.mimetype,
      imageSize: req.file.size,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getProfile,
  getProfileHistory,
  uploadProfile,
};
