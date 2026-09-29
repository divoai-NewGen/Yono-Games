import { v2 as cloudinary } from 'cloudinary';

export function getCloudinaryClient() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'efvabqpd',
    api_key: process.env.CLOUDINARY_API_KEY || '937373892574827',
    api_secret: process.env.CLOUDINARY_API_SECRET || '4d111Z7Ifi3bfDq669x0O2GCV_w',
    secure: true,
  });
  return cloudinary;
}

export default cloudinary;

/**
 * Upload a Buffer or Base64 string directly to Cloudinary
 */
export async function uploadToCloudinary(
  fileBufferOrBase64: Buffer | string,
  options: { folder?: string; public_id?: string } = {}
): Promise<{ url: string; secure_url: string; public_id: string; format: string }> {
  const client = getCloudinaryClient();
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'yono-games',
      public_id: options.public_id,
      resource_type: 'image' as const,
      format: 'webp' as const,
      quality: 'auto:good' as const,
      fetch_format: 'auto' as const,
    };

    if (typeof fileBufferOrBase64 === 'string') {
      // Base64 or URL
      cloudinary.uploader.upload(fileBufferOrBase64, uploadOptions, (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });
      });
    } else {
      // Buffer
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });
      });
      uploadStream.end(fileBufferOrBase64);
    }
  });
}
