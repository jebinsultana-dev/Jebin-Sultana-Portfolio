// IndexedDB utility for user-uploaded custom featured images
const DB_NAME = 'RabbitHoleCustomCovers';
const STORE_NAME = 'covers';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'slug' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Background sync to dev server disk (public/images/featured) so files persist in published build
async function syncToServer(items: { slug: string; dataUrl: string }[]): Promise<boolean> {
  try {
    const res = await fetch('/api/save-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: items }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveCustomImage(slug: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ slug, dataUrl, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    window.dispatchEvent(new CustomEvent('custom-images-updated', { detail: { slug } }));
    // Asynchronously sync to disk so published build includes the photo
    syncToServer([{ slug, dataUrl }]);
  } catch (err) {
    console.error('Failed to save custom image to IndexedDB:', err);
  }
}

export async function saveBatchImages(items: { slug: string; dataUrl: string }[]): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      for (const item of items) {
        store.put({ slug: item.slug, dataUrl: item.dataUrl, updatedAt: Date.now() });
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    window.dispatchEvent(new CustomEvent('custom-images-updated'));
    // Asynchronously sync to disk so published build includes all photos
    syncToServer(items);
  } catch (err) {
    console.error('Failed to save batch custom images to IndexedDB:', err);
  }
}

export async function syncAllIndexedDBImagesToServer(): Promise<{ syncedCount: number; success: boolean }> {
  try {
    const all = await getAllCustomImages();
    const items = Object.entries(all).map(([slug, dataUrl]) => ({ slug, dataUrl }));
    if (items.length === 0) return { syncedCount: 0, success: true };
    const success = await syncToServer(items);
    return { syncedCount: items.length, success };
  } catch {
    return { syncedCount: 0, success: false };
  }
}

export async function getCustomImage(slug: string): Promise<string | null> {
  try {
    const db = await openDB();
    return await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(slug);
      req.onsuccess = () => {
        if (req.result && req.result.dataUrl) {
          resolve(req.result.dataUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function getAllCustomImages(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    return await new Promise<Record<string, string>>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const result: Record<string, string> = {};
        if (Array.isArray(req.result)) {
          for (const item of req.result) {
            if (item.slug && item.dataUrl) {
              result[item.slug] = item.dataUrl;
            }
          }
        }
        resolve(result);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return {};
  }
}

export async function deleteCustomImage(slug: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(slug);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    window.dispatchEvent(new CustomEvent('custom-images-updated', { detail: { slug } }));
  } catch (err) {
    console.error('Failed to delete custom image:', err);
  }
}

export async function clearAllCustomImages(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    window.dispatchEvent(new CustomEvent('custom-images-updated'));
  } catch (err) {
    console.error('Failed to clear custom images:', err);
  }
}
