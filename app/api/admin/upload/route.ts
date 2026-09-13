import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.png';
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const fileName = `${Date.now()}-${baseName}${ext}`;

    // 1. If deployed to Vercel and Vercel Blob is connected
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`games/${fileName}`, file, {
          access: 'public',
        });
        return NextResponse.json({
          success: true,
          url: blob.url,
          fileName,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          storage: 'vercel-blob',
        });
      } catch (blobErr) {
        console.error('Vercel Blob upload failed, falling back to local write:', blobErr);
      }
    }

    // 2. Local environment fallback: save to public/images/uploads/
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/images/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      storage: 'local',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

