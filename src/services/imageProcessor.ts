// Image processing service:
// 1. Background removal using @imgly/background-removal (free, browser WASM)
// 2. K-beauty ingredient-based canvas background
// 3. Cloudinary upload

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ── Background Removal ─────────────────────────────────────────────────────
export async function removeBackground(imageFile: File): Promise<Blob> {
  // Dynamic import to avoid bundling the large WASM on initial load
  const { removeBackground: bgRemove } = await import('@imgly/background-removal');
  
  const result = await bgRemove(imageFile, {
    publicPath: 'https://unpkg.com/@imgly/background-removal@1.4.5/dist/',
    output: {
      format: 'image/png',
      quality: 0.95,
    },
  });
  
  return result;
}

// ── K-beauty Ingredient Background ────────────────────────────────────────
export async function createIngredientBackground(
  productBlob: Blob,
  ingredients: string,
  productName: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;

    // Parse ingredients
    const ingredientList = ingredients
      .split(',')
      .map(i => i.trim())
      .filter(Boolean)
      .slice(0, 12);

    // ── Draw K-beauty gradient background ───────────────────────────────
    const gradient = ctx.createRadialGradient(400, 400, 50, 400, 400, 600);
    gradient.addColorStop(0, '#FFF0F5');   // light blush center
    gradient.addColorStop(0.4, '#FFE4EE'); // soft pink
    gradient.addColorStop(0.75, '#FADADD'); // petal pink
    gradient.addColorStop(1, '#F2C4CE');   // deeper pink edge
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 800);

    // ── Decorative circles (bokeh effect) ───────────────────────────────
    const circleColors = ['rgba(255,200,220,0.25)', 'rgba(255,182,193,0.2)', 'rgba(255,220,230,0.3)', 'rgba(250,210,220,0.15)'];
    const circles = [
      { x: 100, y: 100, r: 120 }, { x: 700, y: 120, r: 90 },
      { x: 80, y: 680, r: 80 },  { x: 720, y: 700, r: 110 },
      { x: 400, y: 50, r: 60 },  { x: 400, y: 750, r: 70 },
    ];
    circles.forEach((c, i) => {
      const cg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      cg.addColorStop(0, circleColors[i % circleColors.length]);
      cg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Ingredient text scattered around ─────────────────────────────────
    const positions = [
      { x: 60, y: 160, angle: -15 },  { x: 640, y: 100, angle: 12 },
      { x: 30, y: 350, angle: -20 },  { x: 680, y: 280, angle: 15 },
      { x: 60, y: 540, angle: -10 },  { x: 650, y: 450, angle: 18 },
      { x: 80, y: 700, angle: -12 },  { x: 620, y: 650, angle: 10 },
      { x: 260, y: 50, angle: -8 },   { x: 450, y: 740, angle: 5 },
      { x: 180, y: 720, angle: 14 },  { x: 550, y: 730, angle: -6 },
    ];

    ingredientList.forEach((ingredient, i) => {
      const pos = positions[i % positions.length];
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate((pos.angle * Math.PI) / 180);
      
      // Ingredient pill background
      const text = ingredient.length > 18 ? ingredient.substring(0, 16) + '…' : ingredient;
      ctx.font = 'bold 11px Inter, sans-serif';
      const tw = ctx.measureText(text).width;
      
      // Pill shape
      const pw = tw + 20;
      const ph = 22;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 11);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = 'rgba(220,150,170,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Text
      ctx.fillStyle = 'rgba(160,80,100,0.75)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, 0);
      ctx.restore();
    });

    // ── Decorative dots pattern ───────────────────────────────────────────
    for (let i = 0; i < 30; i++) {
      const x = 150 + (i % 6) * 100;
      const y = 120 + Math.floor(i / 6) * 120;
      ctx.fillStyle = `rgba(220,140,160,${0.06 + (i % 4) * 0.02})`;
      ctx.beginPath();
      ctx.arc(x + Math.sin(i) * 30, y + Math.cos(i) * 20, 3 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Korean brand watermark ────────────────────────────────────────────
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(180,100,120,0.3)';
    ctx.textAlign = 'center';
    ctx.fillText('KOREAN SKIN FOOD', 400, 780);

    // ── Load and composite the product image ─────────────────────────────
    const productUrl = URL.createObjectURL(productBlob);
    const productImg = new Image();
    productImg.onload = () => {
      // Scale to fit nicely centered
      const maxSize = 460;
      const scale = Math.min(maxSize / productImg.width, maxSize / productImg.height);
      const drawW = productImg.width * scale;
      const drawH = productImg.height * scale;
      const drawX = (800 - drawW) / 2;
      const drawY = (800 - drawH) / 2 - 10; // Slightly up

      // Subtle product shadow
      ctx.shadowColor = 'rgba(180, 100, 130, 0.2)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.drawImage(productImg, drawX, drawY, drawW, drawH);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      URL.revokeObjectURL(productUrl);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/jpeg', 0.92);
    };
    productImg.onerror = reject;
    productImg.src = productUrl;
  });
}

// ── Cloudinary Upload ──────────────────────────────────────────────────────
export async function uploadToCloudinary(imageBlob: Blob, productName: string): Promise<string> {
  if (!CLOUD_NAME) throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set');
  if (!UPLOAD_PRESET) throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not set. Create an unsigned preset in Cloudinary dashboard.');

  const fileName = productName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  
  const formData = new FormData();
  formData.append('file', imageBlob, fileName + '.jpg');
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'korean-skin-food/products');
  formData.append('public_id', fileName);
  formData.append('quality', 'auto:best');
  formData.append('transformation', 'f_auto,q_auto:best');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return data.secure_url as string;
}

// ── Full Pipeline ──────────────────────────────────────────────────────────
export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export async function processProductImage(
  imageFile: File,
  ingredients: string,
  productName: string,
  onStepUpdate: (steps: ProcessingStep[]) => void
): Promise<string> {
  const steps: ProcessingStep[] = [
    { id: 'bg_remove', label: 'Background সরানো হচ্ছে...', status: 'pending' },
    { id: 'bg_create', label: 'K-beauty Background তৈরি হচ্ছে...', status: 'pending' },
    { id: 'upload', label: 'Cloudinary-তে Upload হচ্ছে...', status: 'pending' },
  ];

  const update = (id: string, status: ProcessingStep['status'], error?: string) => {
    const idx = steps.findIndex(s => s.id === id);
    if (idx !== -1) steps[idx] = { ...steps[idx], status, error };
    onStepUpdate([...steps]);
  };

  // Step 1: Remove background
  update('bg_remove', 'processing');
  let noBgBlob: Blob;
  try {
    noBgBlob = await removeBackground(imageFile);
    update('bg_remove', 'done');
  } catch (e: any) {
    update('bg_remove', 'error', e.message);
    throw e;
  }

  // Step 2: Create K-beauty background
  update('bg_create', 'processing');
  let finalBlob: Blob;
  try {
    finalBlob = await createIngredientBackground(noBgBlob, ingredients, productName);
    update('bg_create', 'done');
  } catch (e: any) {
    update('bg_create', 'error', e.message);
    throw e;
  }

  // Step 3: Upload to Cloudinary
  update('upload', 'processing');
  let imageUrl: string;
  try {
    imageUrl = await uploadToCloudinary(finalBlob, productName);
    update('upload', 'done');
  } catch (e: any) {
    update('upload', 'error', e.message);
    throw e;
  }

  return imageUrl;
}
