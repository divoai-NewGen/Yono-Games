import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadToCloudinary } from '@/utils/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.png';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const publicId = `${Date.now()}-${baseName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload directly to Cloudinary CDN
    const result = await uploadToCloudinary(buffer, {
      folder: 'yono-games',
      public_id: publicId,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      fileName: `${publicId}.${result.format}`,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      storage: 'cloudinary',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}


