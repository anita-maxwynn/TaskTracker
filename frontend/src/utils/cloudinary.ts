export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export const uploadToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResponse> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration is missing. Please check your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'jira/workspaces');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Upload failed';
      
      // Provide helpful error messages
      if (errorMessage.includes('preset')) {
        throw new Error('Upload preset not found. Please configure Cloudinary upload preset.');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  const transformString = transformations.join(',');
  
  // Insert transformations before /upload/ in the URL
  return url.replace('/upload/', `/upload/${transformString}/`);
};
