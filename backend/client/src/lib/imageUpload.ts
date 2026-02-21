import { API_BASE } from "./queryClient";

export async function uploadImage(file: File): Promise<string | null> {
  if (!file) return null;
  const backendBase = API_BASE;
  const rawToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const token = rawToken && (rawToken === 'dev-access-token' || rawToken.split('.').length === 3) ? rawToken : null;
  
  try {
    // Use direct server-side upload (no CORS issues)
    const formData = new FormData();
    formData.append('image', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${backendBase}/api/upload/image`, {
      method: 'POST',
      headers: headers,
      credentials: 'include',
      body: formData,
    });
    
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    console.log('✅ Image uploaded successfully:', data.url);
    return data.url as string;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
}

export async function uploadMultipleImages(images: { file?: File; caption: string; previewUrl?: string }[]): Promise<{ url: string; caption: string }[]> {
  console.log('🖼️ Uploading multiple images:', images.length, 'images');
  
  const uploadPromises = images.map(async (img, index) => {
    if (img.file) {
      console.log(`📤 Uploading NEW image ${index + 1}:`, img.file.name, 'Caption:', img.caption);
      const url = await uploadImage(img.file);
      if (url) {
        console.log(`✅ Image ${index + 1} uploaded successfully:`, url);
        return { url, caption: img.caption };
      } else {
        console.error(`❌ Failed to upload image ${index + 1}`);
        return null; // Return null for failed uploads
      }
    } else if (img.previewUrl) {
      // Keep existing images (may already be public R2 URLs)
      console.log(`💾 Keeping existing image ${index + 1}:`, img.previewUrl, 'Caption:', img.caption);
      return { url: img.previewUrl, caption: img.caption };
    } else {
      console.log(`⏭️ Skipping empty image slot ${index + 1}`);
      return null; // Return null for empty slots
    }
  });

  const results = await Promise.all(uploadPromises);
  // Filter out null results (failed uploads or empty slots)
  const validResults = results.filter((result): result is { url: string; caption: string } => result !== null);
  console.log('🎯 Upload results:', validResults.length, 'valid images out of', images.length);
  return validResults;
}
