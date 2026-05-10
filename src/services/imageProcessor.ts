import { removeBackground } from '@imgly/background-removal';

export interface ProcessedImageResult {
  blob: Blob;
  dataUrl: string;
}

/**
 * Professional K-Beauty Image Processor
 * 1. Removes background from product photo
 * 2. Adds aesthetic gradient + ingredients text background
 * 3. Returns final Blob for upload
 */
export async function processProductImage(
  imageFile: File,
  ingredients: string,
  onProgress?: (msg: string) => void
): Promise<ProcessedImageResult> {
  
  if (onProgress) onProgress('📸 ব্যাকগ্রাউন্ড রিমুভ হচ্ছে (WASM)...');
  
  // 1. Remove Background
  const config = {
    publicPath: 'https://static.img.ly/packages/@imgly/background-removal@1.7.0/dist/',
  };
  const removedBgBlob = await removeBackground(imageFile, config);
  const removedBgUrl = URL.createObjectURL(removedBgBlob);

  if (onProgress) onProgress('🎨 এস্থেটিক ব্যাকগ্রাউন্ড তৈরি হচ্ছে...');

  // 2. Create Canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not found');

  canvas.width = 1080;
  canvas.height = 1080;

  // 3. Draw Aesthetic Background (Gradient)
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, '#fff5f7'); // Light pink
  gradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);

  // Add subtle circle patterns
  ctx.fillStyle = 'rgba(255, 192, 203, 0.1)';
  ctx.beginPath();
  ctx.arc(900, 200, 300, 0, Math.PI * 2);
  ctx.fill();

  // 4. Draw Ingredients Text as Background Decor
  const ingredientList = ingredients.split(',').map(i => i.trim()).slice(0, 5);
  ctx.rotate(-0.1);
  ctx.font = 'bold 40px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  
  for (let i = 0; i < 20; i++) {
    const text = ingredientList.join(' • ');
    ctx.fillText(text, -100, i * 80);
    ctx.fillText(text, 400, i * 80 + 40);
  }
  ctx.rotate(0.1);

  // 5. Load and Draw Processed Product
  const productImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = removedBgUrl;
  });

  // Calculate scaling to fit nicely
  const scale = Math.min(800 / productImg.width, 800 / productImg.height);
  const w = productImg.width * scale;
  const h = productImg.height * scale;
  const x = (1080 - w) / 2;
  const y = (1080 - h) / 2 + 50;

  // Draw shadow
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  ctx.drawImage(productImg, x, y, w, h);
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 6. Add Brand Text
  ctx.font = 'bold 30px "Inter", sans-serif';
  ctx.fillStyle = '#ff4d8d';
  ctx.textAlign = 'center';
  ctx.fillText('KOREAN SKIN FOOD', 540, 1000);
  
  ctx.font = '500 20px "Inter", sans-serif';
  ctx.fillStyle = '#999';
  ctx.fillText('PREMIUM K-BEAUTY SELECTION', 540, 1030);

  // 7. Export
  const finalDataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const finalBlob = await (await fetch(finalDataUrl)).blob();

  URL.revokeObjectURL(removedBgUrl);

  return {
    blob: finalBlob,
    dataUrl: finalDataUrl
  };
}
