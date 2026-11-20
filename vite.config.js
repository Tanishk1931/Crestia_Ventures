import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const serviceDirectories = ['rcm', 'it', 'medical', 'healthcare-recruitment', 'shared'];
const serviceContentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.mp4': 'video/mp4',
  '.mtl': 'text/plain; charset=utf-8',
  '.obj': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function copyServicePages() {
  let projectRoot;
  let outputDirectory;

  return {
    name: 'copy-service-pages',
    configResolved(config) {
      projectRoot = config.root;
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      const sourceDirectory = resolve(projectRoot, 'public_html');

      server.middlewares.use((request, response, next) => {
        if (!request.url) {
          next();
          return;
        }

        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const isServicePath = serviceDirectories.some(
          (directory) => pathname === `/${directory}` || pathname.startsWith(`/${directory}/`),
        );
        const isBrandLogo = pathname === '/Gemini_Generated_Image_wglq2wglq2wglq2w.png';

        if (!isServicePath && !isBrandLogo) {
          next();
          return;
        }

        let filePath = resolve(sourceDirectory, `.${pathname}`);
        if (!filePath.startsWith(`${sourceDirectory}${sep}`)) {
          response.statusCode = 403;
          response.end();
          return;
        }

        if (existsSync(filePath) && statSync(filePath).isDirectory()) {
          filePath = resolve(filePath, 'index.html');
        }

        if (!existsSync(filePath)) {
          response.statusCode = 404;
          response.end();
          return;
        }

        response.setHeader(
          'Content-Type',
          serviceContentTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
        );
        createReadStream(filePath).on('error', next).pipe(response);
      });
    },
    closeBundle() {
      const sourceDirectory = resolve(projectRoot, 'public_html');

      for (const directory of serviceDirectories) {
        cpSync(
          resolve(sourceDirectory, directory),
          resolve(outputDirectory, directory),
          { recursive: true },
        );
      }

      cpSync(
        resolve(sourceDirectory, 'Gemini_Generated_Image_wglq2wglq2wglq2w.png'),
        resolve(outputDirectory, 'Gemini_Generated_Image_wglq2wglq2wglq2w.png'),
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), copyServicePages()],
});
