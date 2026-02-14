import sharp from 'sharp';

export async function compressImage(buffer: Buffer, fileName: string): Promise<Buffer> {
  const ext = fileName.toLowerCase().split('.').pop();
  if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) {
    return buffer;
  }

  try {
    const image = sharp(buffer).resize({ width: 2048, withoutEnlargement: true });

    if (ext === 'png') {
      return await image.png({ compressionLevel: 8 }).toBuffer();
    }
    return await image.jpeg({ quality: 80 }).toBuffer();
  } catch (err) {
    console.error('Image compression failed, using original:', err);
    return buffer;
  }
}
