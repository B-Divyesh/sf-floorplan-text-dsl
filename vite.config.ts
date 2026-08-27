import { defineConfig } from 'vite';
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [{
    name: 'copy-static-web-apps-config',
    async closeBundle() {
      await copyFile(root + 'staticwebapp.config.json', root + 'dist/staticwebapp.config.json');
    },
  }],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
