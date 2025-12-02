# 博客项目文档

## 1. 项目概述

这是一个基于 React + TypeScript + Vite 构建的现代化博客应用，具有响应式设计、优雅的 UI 界面和丰富的功能模块。

### 核心功能
- 文章列表展示与分页
- 文章详情查看
- 分类筛选
- 标签管理
- 时间轴视图
- 搜索功能
- 响应式设计
- 鼠标跟随效果

## 2. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^19.1.1 | 前端框架 |
| React DOM | ^19.1.1 | React DOM 渲染 |
| React Router DOM | ^7.9.5 | 路由管理 |
| TypeScript | ~5.9.3 | 类型系统 |
| Vite | ^5.2.0 | 构建工具 |
| Less | ^4.2.0 | CSS 预处理器 |
| ESLint | ^9.36.0 | 代码质量检查 |

## 3. 项目结构

```
├── dist/                 # 构建输出目录
├── public/               # 静态资源目录
├── src/                  # 源代码目录
│   ├── components/       # 组件目录
│   ├── css/              # CSS 样式文件
│   ├── mock/             # 模拟数据
│   ├── pages/            # 页面组件
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── App.less          # App 组件样式
│   ├── App.tsx           # App 组件
│   └── main.tsx          # 应用入口
├── .gitignore            # Git 忽略配置
├── README.md             # 项目说明
├── eslint.config.js      # ESLint 配置
├── index.html            # HTML 模板
├── package.json          # 项目依赖配置
├── postbuild.js          # 构建后脚本
├── simple-server.js      # 简单服务器脚本
├── tsconfig.app.json     # TypeScript 应用配置
├── tsconfig.json         # TypeScript 基础配置
├── tsconfig.node.json    # TypeScript Node 配置
└── vite.config.ts        # Vite 配置
```

## 4. 主要组件与功能

### 4.1 页面组件

#### Header
- 位置：`src/pages/Header.tsx`
- 功能：网站头部，包含导航菜单、搜索按钮等

#### Sidebar
- 位置：`src/pages/Sidebar.tsx`
- 功能：侧边栏，包含分类列表、标签云、目录等

#### Footer
- 位置：`src/pages/Footer.tsx`
- 功能：网站底部，包含版权信息等

### 4.2 功能组件

#### ArticleList
- 位置：`src/components/ArticleList.tsx`
- 功能：文章列表展示，支持分页、分类筛选、标签筛选

#### ArticleDetail
- 位置：`src/components/ArticleDetail.tsx`
- 功能：文章详情展示，支持目录导航、搜索关键词高亮

#### TimelineView
- 位置：`src/components/TimelineView.tsx`
- 功能：时间轴视图，按时间顺序展示文章

#### TagCollection
- 位置：`src/components/TagCollection.tsx`
- 功能：标签云展示，支持按标签筛选文章

#### SearchModal
- 位置：`src/components/SearchModal.tsx`
- 功能：搜索弹窗，支持文章搜索

#### MouseTrail
- 位置：`src/components/MouseTrail.tsx`
- 功能：鼠标跟随效果，增强用户体验

## 5. 路由配置

| 路径 | 组件 | 功能 |
|------|------|------|
| `/` | ArticleList | 首页，展示文章列表 |
| `/article/:id` | ArticleDetail | 文章详情页 |
| `/archives` | TimelineView | 归档页，时间轴视图 |
| `/tags` | TagCollection | 标签页，展示所有标签 |
| `/tags/:tag` | ArticleList | 按标签筛选文章 |
| `/category/:category` | ArticleList | 按分类筛选文章 |
| `/about` | - | 关于页 |

## 6. 开发流程

### 6.1 安装依赖

```bash
npm install
```

### 6.2 启动开发服务器

```bash
npm run dev
```

### 6.3 代码质量检查

```bash
npm run lint
```

### 6.4 构建生产版本

```bash
npm run build
```

### 6.5 预览生产版本

```bash
npm run preview
```

## 7. 构建与部署

### 7.1 构建流程

1. 执行 `npm run build` 生成生产版本
2. 构建完成后自动执行 `postbuild.js` 脚本
3. 构建产物输出到 `dist/` 目录

### 7.2 部署方式

可以将 `dist/` 目录部署到任何静态文件服务器，如：
- GitHub Pages
- Vercel
- Netlify
- 阿里云 OSS
- 腾讯云 COS

## 8. 代码规范

### 8.1 ESLint 配置

项目使用 ESLint 进行代码质量检查，配置文件为 `eslint.config.js`。

### 8.2 TypeScript 配置

项目使用 TypeScript 进行类型检查，主要配置文件包括：
- `tsconfig.json`：基础配置
- `tsconfig.app.json`：应用代码配置
- `tsconfig.node.json`：Node 代码配置

### 8.3 命名规范

- 组件名：大驼峰命名法，如 `ArticleList`
- 文件名：大驼峰命名法，如 `ArticleList.tsx`
- 变量名：小驼峰命名法，如 `selectedCategory`
- 类型名：大驼峰命名法，如 `Article`

## 9. 状态管理

项目采用 React 内置的状态管理方案：
- 类组件使用 `this.state` 和 `this.setState`
- 函数组件可以使用 `useState` Hook

## 10. 数据管理

### 10.1 模拟数据

项目使用模拟数据进行开发，位于 `src/mock/articles.ts`。

### 10.2 数据结构

```typescript
interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}
```

## 11. 样式管理

### 11.1 样式文件结构

- 全局样式：`src/styles/`
- 组件样式：`src/css/`
- 组件内联样式：使用 `style` 属性

### 11.2 Less 变量

项目使用 Less 变量进行样式管理，位于 `src/styles/variables.less`。

## 12. 响应式设计

项目支持响应式设计，适配不同屏幕尺寸：
- 移动端：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

响应式样式位于 `src/styles/responsive.less`。

## 13. 性能优化

### 13.1 代码分割

使用 React.lazy 和 Suspense 进行组件懒加载

### 13.2 图片优化

- 使用适当尺寸的图片
- 考虑使用图片懒加载

### 13.3 滚动优化

- 防抖处理滚动事件
- 合理使用 `shouldComponentUpdate` 或 React.memo

## 14. 浏览器兼容性

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 15. 开发工具

### 15.1 IDE 推荐

- Visual Studio Code
- WebStorm

### 15.2 推荐插件

- ESLint
- Prettier
- TypeScript Hero
- React DevTools

## 16. 常见问题与解决方案

### 16.1 构建失败

**问题**：执行 `npm run build` 失败

**解决方案**：
1. 检查依赖是否安装完整：`npm install`
2. 检查代码是否有语法错误：`npm run lint`
3. 检查 TypeScript 类型是否正确：`npx tsc --noEmit`

### 16.2 开发服务器无法启动

**问题**：执行 `npm run dev` 无法启动开发服务器

**解决方案**：
1. 检查端口是否被占用
2. 检查 Vite 配置是否正确
3. 检查 Node.js 版本是否符合要求

## 17. 后续规划

1. 添加用户认证功能
2. 支持评论系统
3. 添加文章编辑器
4. 接入真实后端 API
5. 添加主题切换功能
6. 优化移动端体验
7. 添加 PWA 支持

## 18. 贡献指南

1. Fork 项目
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

**更新时间**：2025-12-01
**版本**：v0.0.0