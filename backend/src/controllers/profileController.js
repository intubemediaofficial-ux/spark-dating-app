const prisma = require('../config/database');
const cloudinary = require('../config/cloudinary');

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, age, bio, interests, latitude, longitude, city, minAgePreference, maxAgePreference, maxDistance, genderPreference } = req.body;

    if (age && age < 18) {
      return res.status(400).json({ error: 'Age must be 18 or older' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(age && { age }),
        ...(bio !== undefined && { bio }),
        ...(interests && { interests }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(city && { city }),
        ...(minAgePreference && { minAgePreference }),
        ...(maxAgePreference && { maxAgePreference }),
        ...(maxDistance && { maxDistance }),
        ...(genderPreference && { genderPreference }),
      },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Upload photo
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'spark-dating/profiles', transformation: [{ width: 800, height: 800, crop: 'limit' }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Add photo URL to user's photos array
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        photos: { push: result.secure_url },
      },
    });

    res.json({ photoUrl: result.secure_url, user });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};

// Delete photo
const deletePhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const user = req.user;

    const updatedPhotos = user.photos.filter(p => p !== photoUrl);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { photos: updatedPhotos },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
};

// Get user profile by ID
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        bio: true,
        photos: true,
        interests: true,
        city: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

module.exports = { updateProfile, uploadPhoto, deletePhoto, getProfile };
