const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');

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

async function uploadProfile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'image file is required' });
    }

    const existingProfile = await Profile.findOne().sort({ updatedAt: -1 });
    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    const profileData = {
      name: req.body.name || existingProfile?.name || 'User',
      imageUrl,
      imageFilename: req.file.filename,
      imageMimeType: req.file.mimetype,
      imageSize: req.file.size,
    };

    let profile;

    if (existingProfile) {
      const oldFilePath = path.join(
        __dirname,
        '..',
        'uploads',
        'profiles',
        existingProfile.imageFilename
      );

      profile = await Profile.findByIdAndUpdate(existingProfile._id, profileData, {
        new: true,
        runValidators: true,
      });

      if (
        existingProfile.imageFilename &&
        existingProfile.imageFilename !== req.file.filename &&
        fs.existsSync(oldFilePath)
      ) {
        fs.unlinkSync(oldFilePath);
      }
    } else {
      profile = await Profile.create(profileData);
    }

    res.status(existingProfile ? 200 : 201).json(profile);
  } catch (error) {
    if (req.file) {
      const uploadedFilePath = path.join(
        __dirname,
        '..',
        'uploads',
        'profiles',
        req.file.filename
      );

      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    }

    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getProfile,
  uploadProfile,
};
