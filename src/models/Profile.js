const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'User',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageFilename: {
      type: String,
      required: true,
    },
    imageMimeType: {
      type: String,
      required: true,
    },
    imageSize: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
