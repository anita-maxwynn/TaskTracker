// Test file to verify Cloudinary configuration
console.log('=== Cloudinary Configuration Test ===');
console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
console.log('GitHub Client ID:', import.meta.env.VITE_GITHUB_CLIENT_ID);
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);

if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
  console.error('❌ VITE_CLOUDINARY_CLOUD_NAME is not set!');
}

if (!import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
  console.error('❌ VITE_CLOUDINARY_UPLOAD_PRESET is not set!');
}

export {};
