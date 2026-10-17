import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

const ASSET_FILE_MAP: Record<string, string> = {
  'o-sahib-why-does-this-song-feel-so-divine': 'rh_o_saiba_song_1791648793249.jpg',
  'andaaz-e-karam-the-cruelty-of-loving-too-deeply': 'rh_andaaz_karam_1792094914523.jpg',
  'faasle-to-love-you-even-from-a-distance': 'rh_faasle_distance_1792095487222.jpg',
  'amar-porano-jaha-chay-even-if-you-love-someone-else': 'rh_amar_porano_1792095506073.jpg',
  'jaao-pakhi-be-happy-but-please-dont-forget-me': 'rh_jaao_pakhi_1792095593015.jpg',
  'bonde-maya-lagaise-what-kind-of-magic-is-this': 'rh_bonde_maya_1792095609266.jpg',
  'milon-hobe-koto-dine-the-one-my-heart-keeps-searching-for': 'rh_milon_hobe_1792095623606.jpg',
  'tomay-hrid-majhare-rakhbo-i-wont-let-you-go': 'rh_hrid_majhare_1792095765073.jpg',
  'tum-ho-when-someone-becomes-your-whole-world': 'rh_tum_ho_1792095639713.jpg',
  'maula-mere-maula-when-love-becomes-a-form-of-prayer': 'rh_maula_mere_1792095657517.jpg',
  'tera-woh-pyaar-the-cruelest-goodbyes': 'rh_tera_woh_pyaar_1792095677570.jpg',
  'bahir-bole-when-the-heart-cannot-make-up-its-mind': 'rh_bahir_bole_1792095694935.jpg',
  'the-cruelest-kind-of-gratitude-thank-you-for-breaking-me': 'rh_cruel_gratitude_1792095711794.jpg',
  'chini-na-abar-bodhhoy-chini-the-strange-uncertainty-of-love': 'rh_chini_na_1792095729168.jpg',
  'aaj-jaane-ki-zid-na-karo-if-we-meet-again': 'rh_aaj_jaane_1792095746932.jpg',
  'what-is-special-about-the-vampire-diaries': 'rh_vampire_diaries_1791648767550.jpg',
  'why-you-shouldnt-watch-the-mentalist': 'rh_the_mentalist_1792095551480.jpg',
  'rewatch-wake-up-sid-even-after-the-100th-time': 'rh_wake_up_sid_1792095570151.jpg',
  'bangladesh-bank-heist-the-details-that-made-me-keep-reading': 'rh_bank_heist_1792095520511.jpg',
};

function imagePersistencePlugin(): Plugin {
  return {
    name: 'image-persistence-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-image', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const items = Array.isArray(data.images)
              ? data.images
              : data.slug && data.dataUrl
              ? [{ slug: data.slug, dataUrl: data.dataUrl }]
              : [];

            if (items.length === 0) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'No images provided' }));
              return;
            }

            const publicDir = path.resolve(__dirname, 'public/images/featured');
            const assetsDir = path.resolve(__dirname, 'src/assets/images');
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }
            if (!fs.existsSync(assetsDir)) {
              fs.mkdirSync(assetsDir, { recursive: true });
            }

            const savedSlugs: string[] = [];
            for (const item of items) {
              if (item.slug && item.dataUrl && item.dataUrl.startsWith('data:')) {
                const base64Data = item.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                // 1. Save directly to public/images/featured/
                const publicFilePath = path.join(publicDir, `${item.slug}.jpg`);
                fs.writeFileSync(publicFilePath, buffer);

                // 2. Overwrite the corresponding file in src/assets/images/ so Vite bundling uses the user image
                const assetFilename = ASSET_FILE_MAP[item.slug];
                if (assetFilename) {
                  const assetFilePath = path.join(assetsDir, assetFilename);
                  fs.writeFileSync(assetFilePath, buffer);
                }

                savedSlugs.push(item.slug);
              }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, savedCount: savedSlugs.length, savedSlugs }));
          } catch (err: any) {
            console.error('Error saving image:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), imagePersistencePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
