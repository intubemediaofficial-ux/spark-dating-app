const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateProfile, uploadPhoto, deletePhoto, getProfile } = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.put('/update', authenticate, updateProfile);
router.post('/photo', authenticate, upload.single('photo'), uploadPhoto);
router.delete('/photo', authenticate, deletePhoto);
router.get('/:userId', authenticate, getProfile);

module.exports = router;
