# 组件文档

## 组件列表

| 组件名 | 文件路径 | 功能描述 |
|--------|----------|----------|
| ArticleList | ArticleList.tsx | 文章列表展示，支持分页、分类筛选、标签筛选 |
| ArticleDetail | ArticleDetail.tsx | 文章详情展示，支持目录导航、搜索关键词高亮 |
| TimelineView | TimelineView.tsx | 时间轴视图，按时间顺序展示文章 |
| TagCollection | TagCollection.tsx | 标签云展示，支持按标签筛选文章 |
| SearchModal | SearchModal.tsx | 搜索弹窗，支持文章搜索 |
| MouseTrail | MouseTrail.tsx | 鼠标跟随效果，增强用户体验 |

## 组件详细文档

### ArticleList

**文件路径**：`ArticleList.tsx`

**Props**：

| 属性名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| articles | Article[] | 文章列表数据 | 是 |
| onArticleClick | (article: Article) => void | 文章点击事件处理函数 | 是 |
| onCategorySelect | (category: string) => void | 分类选择事件处理函数 | 是 |
| onTagSelect | (tag: string) => void | 标签选择事件处理函数 | 是 |

**功能**：
- 展示文章列表，包括标题、摘要、发布日期、分类、标签等信息
- 支持文章点击跳转到详情页
- 支持分类筛选
- 支持标签筛选

### ArticleDetail

**文件路径**：`ArticleDetail.tsx`

**Props**：

| 属性名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| article | Article | 文章数据 | 是 |
| onBack | () => void | 返回列表事件处理函数 | 是 |
| searchKeyword | string | 搜索关键词，用于高亮显示 | 否 |
| onCategorySelect | (category: string) => void | 分类选择事件处理函数 | 是 |
| onTagSelect | (tag: string) => void | 标签选择事件处理函数 | 是 |
| onTocUpdate | (toc: June_Index.TocItem[]) => void | 目录更新事件处理函数 | 否 |
| onParentIdsUpdate | (parentIds: string[]) => void | 父分类ID更新事件处理函数 | 否 |

**State**：

| 状态名 | 类型 | 描述 |
|--------|------|------|
| fullscreenImage | string \| null | 当前全屏显示的图片URL |
| allImages | string[] | 文章中所有图片的URL列表 |
| currentImageIndex | number | 当前显示图片的索引 |
| scale | number | 图片缩放比例 |
| rotation | number | 图片旋转角度 |
| flipHorizontal | boolean | 是否水平翻转图片 |
| flipVertical | boolean | 是否垂直翻转图片 |
| isDragging | boolean | 是否正在拖拽图片 |
| positionX | number | 图片X轴位置 |
| positionY | number | 图片Y轴位置 |
| startX | number | 拖拽开始时的X坐标 |
| startY | number | 拖拽开始时的Y坐标 |

**功能**：
- 展示文章详细内容
- 支持目录导航
- 支持搜索关键词高亮
- 支持图片查看器，包括缩放、旋转、翻转、拖拽等功能
- 支持返回列表页

### TimelineView

**文件路径**：`TimelineView.tsx`

**功能**：
- 按时间顺序展示文章
- 支持按年份分组
- 支持点击文章跳转到详情页

### TagCollection

**文件路径**：`TagCollection.tsx`

**功能**：
- 展示标签云
- 支持按标签筛选文章
- 标签大小根据使用频率动态调整

### SearchModal

**文件路径**：`SearchModal.tsx`

**功能**：
- 提供搜索功能，支持关键词搜索
- 支持按标题、内容、标签搜索
- 支持搜索结果高亮显示
- 支持点击搜索结果跳转到文章详情页

### MouseTrail

**文件路径**：`MouseTrail.tsx`

**功能**：
- 实现鼠标跟随效果
- 增强用户体验
- 支持自定义样式

## 组件使用示例

### ArticleList 使用示例

```tsx
import ArticleList from './ArticleList';

<ArticleList
  articles={articles}
  onArticleClick={(article) => handleArticleClick(article)}
  onCategorySelect={(category) => handleCategorySelect(category)}
  onTagSelect={(tag) => handleTagSelect(tag)}
/>
```

### ArticleDetail 使用示例

```tsx
import ArticleDetail from './ArticleDetail';

<ArticleDetail
  article={article}
  onBack={() => handleBackToList()}
  searchKeyword={searchKeyword}
  onCategorySelect={(category) => handleCategorySelect(category)}
  onTagSelect={(tag) => handleTagSelect(tag)}
  onTocUpdate={(toc) => handleTocUpdate(toc)}
  onParentIdsUpdate={(parentIds) => handleParentIdsUpdate(parentIds)}
/>
```

## 组件开发规范

1. **命名规范**：
   - 组件名使用大驼峰命名法，如 `ArticleList`
   - 文件名与组件名保持一致，如 `ArticleList.tsx`
   - 类型定义使用命名空间，如 `June_ArticleList`

2. **文件结构**：
   - 每个组件对应一个 `.tsx` 文件
   - 组件样式文件位于 `src/css/` 目录下，如 `ArticleList.less`
   - 组件类型定义位于 `src/types/` 目录下，如 `ArticleList.d.ts`

3. **Props 定义**：
   - 所有 Props 必须有明确的类型定义
   - 可选 Props 使用 `?` 标记
   - 为 Props 添加适当的注释

4. **State 管理**：
   - 类组件使用 `this.state` 和 `this.setState`
   - 函数组件使用 `useState` Hook
   - 状态名使用小驼峰命名法

5. **事件处理**：
   - 事件处理函数名使用 `handle` 前缀，如 `handleArticleClick`
   - 事件处理函数使用箭头函数绑定 `this`

6. **代码风格**：
   - 遵循 ESLint 配置
   - 使用 TypeScript 严格模式
   - 代码缩进使用 2 个空格
   - 每行代码不超过 120 个字符

7. **注释规范**：
   - 为组件添加功能描述注释
   - 为 Props 和 State 添加注释
   - 为复杂逻辑添加注释
   - 为关键函数添加注释

## 组件测试

1. **单元测试**：
   - 为每个组件编写单元测试
   - 测试组件的渲染、Props 传递、事件处理等

2. **集成测试**：
   - 测试组件之间的交互
   - 测试组件与路由、状态管理的集成

3. **E2E 测试**：
   - 测试组件在真实浏览器环境中的表现
   - 测试组件的响应式设计

## 组件性能优化

1. **避免不必要的渲染**：
   - 使用 `React.memo` 包装函数组件
   - 类组件使用 `shouldComponentUpdate` 或 `PureComponent`

2. **代码分割**：
   - 使用 `React.lazy` 和 `Suspense` 进行组件懒加载
   - 按路由分割代码

3. **优化列表渲染**：
   - 使用 `key` 属性优化列表渲染
   - 对于长列表，考虑使用虚拟滚动

4. **优化事件处理**：
   - 使用事件委托减少事件监听器数量
   - 使用防抖和节流优化高频事件

5. **优化图片加载**：
   - 使用适当尺寸的图片
   - 考虑使用图片懒加载
   - 使用 WebP 格式图片

## 组件版本管理

1. **版本号格式**：
   - 使用语义化版本号，如 `v1.0.0`
   - 主版本号：不兼容的 API 变更
   - 次版本号：向下兼容的功能性新增
   - 修订号：向下兼容的问题修正

2. **版本发布流程**：
   - 更新组件版本号
   - 更新组件文档
   - 编写 CHANGELOG
   - 提交代码并打标签

3. **版本回滚流程**：
   - 恢复到之前的版本标签
   - 更新组件版本号
   - 更新组件文档
   - 提交代码并打标签

## 组件文档更新

1. **更新频率**：
   - 组件功能变更时，及时更新文档
   - 组件 API 变更时，及时更新文档
   - 组件样式变更时，及时更新文档

2. **更新内容**：
   - 组件功能描述
   - Props 定义
   - State 定义
   - 使用示例
   - 开发规范
   - 测试方法
   - 性能优化
   - 版本管理

3. **更新流程**：
   - 修改组件文档
   - 提交代码
   - 审核文档
   - 发布文档

## 组件贡献指南

1. **Fork 项目**
2. 创建特性分支：`git checkout -b feature/AmazingComponent`
3. 开发组件
4. 编写组件文档
5. 编写测试用例
6. 提交更改：`git commit -m 'Add some AmazingComponent'`
7. 推送到分支：`git push origin feature/AmazingComponent`
8. 提交 Pull Request

## 组件维护

1. **Bug 修复**：
   - 及时响应 Bug 报告
   - 分析 Bug 原因
   - 修复 Bug
   - 编写测试用例
   - 更新文档

2. **功能增强**：
   - 分析功能需求
   - 设计实现方案
   - 开发新功能
   - 编写测试用例
   - 更新文档

3. **性能优化**：
   - 分析性能瓶颈
   - 设计优化方案
   - 实施优化
   - 测试优化效果
   - 更新文档

4. **文档维护**：
   - 定期检查文档的准确性
   - 及时更新文档
   - 优化文档结构
   - 增强文档可读性

## 组件废弃流程

1. **废弃通知**：
   - 在组件文档中添加废弃通知
   - 在控制台输出废弃警告
   - 提供替代方案

2. **废弃周期**：
   - 至少保留一个主版本的废弃通知
   - 在下一个主版本中移除组件

3. **移除组件**：
   - 删除组件文件
   - 删除组件样式文件
   - 删除组件类型定义
   - 更新组件文档
   - 更新依赖组件

## 组件迁移指南

1. **迁移准备**：
   - 分析组件依赖关系
   - 设计迁移方案
   - 编写迁移文档

2. **迁移步骤**：
   - 安装新组件
   - 更新组件引用
   - 调整组件 Props
   - 测试迁移效果
   - 部署迁移后的代码

3. **迁移注意事项**：
   - 保持向后兼容
   - 提供迁移工具
   - 提供迁移支持
   - 监控迁移效果

## 组件最佳实践

1. **单一职责原则**：
   - 每个组件只负责一个功能
   - 组件功能尽量单一
   - 避免组件过于复杂

2. **可复用性**：
   - 设计通用组件
   - 组件 Props 尽量灵活
   - 支持自定义样式

3. **可测试性**：
   - 组件设计便于测试
   - 编写完整的测试用例
   - 测试覆盖率达到 80% 以上

4. **可维护性**：
   - 代码结构清晰
   - 注释完整
   - 文档齐全

5. **性能优化**：
   - 避免不必要的渲染
   - 优化组件加载速度
   - 优化组件运行时性能

6. **用户体验**：
   - 组件交互流畅
   - 组件样式美观
   - 组件响应式设计

7. ** accessibility**：
   - 支持键盘导航
   - 支持屏幕阅读器
   - 符合 WCAG 标准

8. **国际化**：
   - 支持多语言
   - 支持不同地区的日期、时间格式
   - 支持不同地区的数字格式

## 组件生态系统

1. **组件库**：
   - 建立组件库
   - 统一组件风格
   - 统一组件 API

2. **组件工具**：
   - 组件生成工具
   - 组件测试工具
   - 组件文档工具

3. **组件社区**：
   - 建立组件社区
   - 鼓励社区贡献
   - 分享组件最佳实践

## 组件未来规划

1. **组件现代化**：
   - 迁移到函数组件
   - 使用 Hooks
   - 支持 React 18+ 特性

2. **组件性能优化**：
   - 使用 React.memo
   - 使用 useMemo 和 useCallback
   - 优化组件渲染

3. **组件样式优化**：
   - 使用 CSS-in-JS
   - 支持主题切换
   - 支持动态样式

4. **组件测试优化**：
   - 使用 Jest 和 React Testing Library
   - 编写自动化测试
   - 提高测试覆盖率

5. **组件文档优化**：
   - 使用 Storybook
   - 支持交互式文档
   - 支持代码示例

6. **组件国际化**：
   - 支持多语言
   - 支持 RTL 布局
   - 支持不同地区的文化习惯

## 总结

本组件文档提供了组件开发、使用、测试、维护的全面指南，旨在帮助开发者更好地理解和使用组件，提高组件开发效率和质量。

组件文档将持续更新，以反映组件的最新状态和最佳实践。

---

**更新时间**：2025-12-01
**版本**：v0.0.0