const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, 'public');
const assetPath = path.join(publicDir, 'mimamad-salman.png');
const hqAssetPath = path.join(publicDir, 'mimamad-salman-hq.png');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function serveFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Cache-Control': 'no-cache',
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const requestPath = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`).pathname;

  if (requestPath === '/manus-routes.json') {
    serveFile(response, path.join(publicDir, 'manus-routes.json'));
    return;
  }

  if (requestPath === '/manus-storage/pasted_file_LuxCHV_IMG_4262_3952b3f4.PNG') {
    serveFile(response, assetPath);
    return;
  }

  if (requestPath === '/manus-storage/mimamad-salman-hq_b85c5a8a.png') {
    serveFile(response, hqAssetPath);
    return;
  }

  const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
  const safePath = path.normalize(relativePath).replace(/^\.\.(?:[\\/]|$)/, '');
  const filePath = path.join(__dirname, safePath);

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }

  serveFile(response, filePath);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Mimamad Salman landing page listening on ${port}`);
});
