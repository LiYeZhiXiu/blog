import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, URL } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 服务器配置
const PORT = 8082;
const PUBLIC_DIR = path.join(__dirname, 'dist');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 解析请求URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let filePath = path.join(PUBLIC_DIR, parsedUrl.pathname);

  // 如果请求的是目录，默认提供index.html
  if (fs.statSync(filePath, { throwIfNoEntry: false })?.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // 读取文件并返回
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // 设置MIME类型
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// 获取文件的MIME类型
function getContentType(ext) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-sfnt',
    '.eot': 'application/vnd.ms-fontobject'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// 启动服务器
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});