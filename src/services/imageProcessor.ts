import { removeBackground } from '@imgly/background-removal';

export interface ProcessedImageResult {
  blob: Blob;
  dataUrl: string;
}

export type DesignTemplate = 'PINK_BLOSSOM' | 'LUXURY_MINIMAL' | 'NATURE_PURE' | 'SOFT_GLOW';

/**
 * Professional K-Beauty Image Processor with Templates
 */
export async function processProductImage(
  imageFile: File,
  ingredients: string,
  templateId: DesignTemplate = 'PINK_BLOSSOM',
  onProgress?: (msg: string) => void
): Promise<ProcessedImageResult> {
  
  if (onProgress) onProgress('📸 ব্যাকগ্রাউন্ড রিমুভ হচ্ছে (WASM)...');
  
  // 1. Remove Background
  const config = {
    publicPath: 'https://static.img.ly/packages/@imgly/background-removal@1.7.0/dist/',
  };
  const removedBgBlob = await removeBackground(imageFile, config);
  const removedBgUrl = URL.createObjectURL(removedBgBlob);

  if (onProgress) onProgress('🎨 এস্থেটিক টেম্পলেট অ্যাপ্লাই হচ্ছে...');

  // 2. Create Canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not found');

  canvas.width = 1080;
  canvas.height = 1080;

  // 3. Apply Template Background
  switch (templateId) {
    case 'PINK_BLOSSOM':
      drawPinkBlossom(ctx);
      break;
    case 'LUXURY_MINIMAL':
      drawLuxuryMinimal(ctx);
      break;
    case 'NATURE_PURE':
      drawNaturePure(ctx);
      break;
    case 'SOFT_GLOW':
      drawSoftGlow(ctx);
      break;
  }

  // 4. Draw Overlay Decor (Ingredients)
  drawIngredientsOverlay(ctx, ingredients);

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
  const y = (1080 - h) / 2;

  // Draw shadow
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 30;
  ctx.drawImage(productImg, x, y, w, h);
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 6. Brand Identity
  drawBrandIdentity(ctx, templateId);

  // 7. Export
  const finalDataUrl = canvas.toDataURL('image/jpeg', 0.9);
  const finalBlob = await (await fetch(finalDataUrl)).blob();

  URL.revokeObjectURL(removedBgUrl);

  return {
    blob: finalBlob,
    dataUrl: finalDataUrl
  };
}

// ── Template Helpers ─────────────────────────────────────────────────────────

function drawPinkBlossom(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
  gradient.addColorStop(0, '#FFF5F7');
  gradient.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);

  // Soft circle patterns
  ctx.fillStyle = 'rgba(255, 182, 193, 0.15)';
  ctx.beginPath(); ctx.arc(900, 200, 400, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(100, 900, 300, 0, Math.PI * 2); ctx.fill();
}

function drawLuxuryMinimal(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1080, 1080);

  // Fine border
  ctx.strokeStyle = '#F0F0F0';
  ctx.lineWidth = 40;
  ctx.strokeRect(20, 20, 1040, 1040);

  // Luxury geometric accent
  ctx.fillStyle = '#F9F9F9';
  ctx.fillRect(0, 700, 1080, 380);
}

function drawNaturePure(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, '#F6FFF8');
  gradient.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);

  // Leafy green circles
  ctx.fillStyle = 'rgba(167, 201, 164, 0.1)';
  ctx.beginPath(); ctx.arc(1000, 540, 350, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 400, 0, Math.PI * 2); ctx.fill();
}

function drawSoftGlow(ctx: CanvasRenderingContext2D) {
  const radial = ctx.createRadialGradient(540, 540, 100, 540, 540, 800);
  radial.addColorStop(0, '#FFFFFF');
  radial.addColorStop(1, '#FFF9F0');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 1080, 1080);

  // Glow spots
  ctx.fillStyle = 'rgba(255, 223, 186, 0.2)';
  ctx.beginPath(); ctx.arc(200, 200, 400, 0, Math.PI * 2); ctx.fill();
}

function drawIngredientsOverlay(ctx: CanvasRenderingContext2D, ingredients: string) {
  const list = ingredients.split(',').map(i => i.trim()).slice(0, 4);
  if (list.length === 0) return;

  ctx.save();
  ctx.rotate(-0.05);
  ctx.font = 'bold 32px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  
  for (let i = 0; i < 15; i++) {
    const text = list.join('  •  ').toUpperCase();
    ctx.fillText(text, -100, i * 100);
    ctx.fillText(text, 500, i * 100 + 50);
  }
  ctx.restore();
}

function drawBrandIdentity(ctx: CanvasRenderingContext2D, templateId: DesignTemplate) {
  const isDark = templateId === 'LUXURY_MINIMAL';
  
  ctx.textAlign = 'center';
  
  // Tagline
  ctx.font = 'black 18px "Inter", sans-serif';
  ctx.fillStyle = '#BBB';
  ctx.letterSpacing = '10px';
  ctx.fillText('PREMIUM K-BEAUTY', 540, 1000);

  // Logo Text
  ctx.font = 'black 42px "Inter", sans-serif';
  ctx.fillStyle = templateId === 'NATURE_PURE' ? '#4A7C59' : '#E91E8C';
  ctx.letterSpacing = '2px';
  ctx.fillText('KOREAN SKIN FOOD', 540, 1050);
}
