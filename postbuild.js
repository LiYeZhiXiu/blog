// 构建后脚本：将HTML中的module标签替换为普通script标签
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径（ES模块方式）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取构建后的HTML文件
const htmlPath = path.join(__dirname, 'dist', 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 将<script type="module">替换为普通的<script>
htmlContent = htmlContent.replace(/<script type="module"/g, '<script');

// 保存修改后的HTML文件
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log('HTML中的module标签已替换为普通script标签');