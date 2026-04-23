require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testImagePath = path.join(__dirname, '..', '..', 'tirupur-textile-hub-frontend', 'src', 'assets', 'welcome_pg.jpg');

console.log('Attempting to upload:', testImagePath);

cloudinary.uploader.upload(testImagePath, {
  folder: 'texconnect-test',
}, (error, result) => {
  if (error) {
    console.error('Upload Failed:', error);
  } else {
    console.log('Upload Successful!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  }
});
