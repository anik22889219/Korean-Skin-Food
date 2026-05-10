const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

/**
 * Upload an image file to Cloudinary using unsigned upload preset.
 * @param file - Image File object (from <input type="file"> or camera)
 * @param onProgress - Optional progress callback (0-100)
 * @returns Cloudinary secure_url
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary config missing. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env');
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url as string);
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);

    xhr.send(form);
  });
}

/**
 * Upload a base64 / dataURL string to Cloudinary.
 * Useful when the image was generated via Canvas.
 */
export async function uploadBase64ToCloudinary(
  dataUrl: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary config missing.');
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url as string);
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));

    const params = new URLSearchParams({
      file: dataUrl,
      upload_preset: UPLOAD_PRESET,
    });

    xhr.send(params.toString());
  });
}
