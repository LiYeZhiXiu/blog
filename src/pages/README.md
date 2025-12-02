# 页面组件文档

## 页面组件列表

| 组件名 | 文件路径 | 功能描述 |
|--------|----------|----------|
| Header | Header.tsx | 网站头部，包含导航菜单、搜索按钮等 |
| Sidebar | Sidebar.tsx | 侧边栏，包含分类列表、标签云、目录等 |
| Footer | Footer.tsx | 网站底部，包含版权信息等 |

## 页面组件详细文档

### Header

**文件路径**：`Header.tsx`

**Props**：

| 属性名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| onBack | () => void | 返回按钮点击事件处理函数 | 否 |
| onOpenSearchModal | () => void | 打开搜索弹窗事件处理函数 | 否 |
| onCategorySelect | (category: string) => void | 分类选择事件处理函数 | 否 |
| onTimelineToggle | () => void | 时间轴切换事件处理函数 | 否 |
| showTimeline | boolean | 是否显示时间轴切换按钮 | 否 |
| activePage | string | 当前活动页面 | 否 |
| onPageChange | (page: string) => void | 页面切换事件处理函数 | 否 |

**State**：

| 状态名 | 类型 | 描述 |
|--------|------|------|
| mobileMenuOpen | boolean | 移动端菜单是否打开 |
| searchQuery | string | 搜索关键词 |

**功能**：
- 展示网站标题和Logo
- 提供导航菜单，支持页面切换
- 提供搜索功能入口
- 支持移动端响应式设计
- 显示当前活动页面

### Sidebar

**文件路径**：`Sidebar.tsx`

**Props**：

| 属性名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| isFixed | boolean | 侧边栏是否固定 | 否 |
| onCategorySelect | (category: string) => void | 分类选择事件处理函数 | 是 |
| selectedCategory | string | 当前选中的分类 | 否 |
| categories | Array<{ name: string, count: number }> | 分类列表 | 是 |
| toc | June_Index.TocItem[] | 文章目录 | 否 |
| onParentIdsUpdate | (parentIds: string[]) => void | 父分类ID更新事件处理函数 | 否 |
| parentIds | string[] | 父分类ID列表 | 否 |
| onPageChange | (page: string) => void | 页面切换事件处理函数 | 是 |
| onTimelineToggle | () => void | 时间轴切换事件处理函数 | 是 |

**功能**：
- 展示分类列表，支持按分类筛选文章
- 展示标签云，支持按标签筛选文章
- 展示文章目录，支持目录导航
- 支持固定定位
- 支持响应式设计

### Footer

**文件路径**：`Footer.tsx`

**功能**：
- 展示网站版权信息
- 展示联系方式
- 展示备案信息
- 支持响应式设计

## 页面组件使用示例

### Header 使用示例

```tsx
import Header from './Header';

<Header
  onOpenSearchModal={handleOpenSearchModal}
  onCategorySelect={handleCategorySelect}
  onTimelineToggle={handleTimelineToggle}
  activePage={activePage}
  onPageChange={handlePageChange}
/>
```

### Sidebar 使用示例

```tsx
import Sidebar from './Sidebar';

<Sidebar
  isFixed={isFixed}
  onCategorySelect={handleCategorySelect}
  selectedCategory={selectedCategory}
  categories={categories}
  toc={location.pathname.includes('/article/') ? currentToc : undefined}
  onParentIdsUpdate={handleParentIdsUpdate}
  parentIds={parentIds}
  onPageChange={handlePageChange}
  onTimelineToggle={handleTimelineToggle}
/>
```

### Footer 使用示例

```tsx
import Footer from './Footer';

<Footer />
```

## 页面组件开发规范

1. **命名规范**：
   - 组件名使用大驼峰命名法，如 `Header`
   - 文件名与组件名保持一致，如 `Header.tsx`
   - 类型定义使用命名空间，如 `June_Header`

2. **文件结构**：
   - 每个页面组件对应一个 `.tsx` 文件
   - 页面组件样式文件位于 `src/css/` 目录下，如 `Header.less`
   - 页面组件类型定义位于 `src/types/` 目录下，如 `Header.d.ts`

3. **Props 定义**：
   - 所有 Props 必须有明确的类型定义
   - 可选 Props 使用 `?` 标记
   - 为 Props 添加适当的注释

4. **State 管理**：
   - 类组件使用 `this.state` 和 `this.setState`
   - 函数组件使用 `useState` Hook
   - 状态名使用小驼峰命名法

5. **事件处理**：
   - 事件处理函数名使用 `handle` 前缀，如 `handleOpenSearchModal`
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

## 页面组件测试

1. **单元测试**：
   - 为每个页面组件编写单元测试
   - 测试组件的渲染、Props 传递、事件处理等

2. **集成测试**：
   - 测试页面组件之间的交互
   - 测试页面组件与路由、状态管理的集成

3. **E2E 测试**：
   - 测试页面组件在真实浏览器环境中的表现
   - 测试页面组件的响应式设计

## 页面组件性能优化

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

## 页面组件版本管理

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

## 页面组件文档更新

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

## 页面组件贡献指南

1. **Fork 项目**
2. 创建特性分支：`git checkout -b feature/AmazingPageComponent`
3. 开发页面组件
4. 编写组件文档
5. 编写测试用例
6. 提交更改：`git commit -m 'Add some AmazingPageComponent'`
7. 推送到分支：`git push origin feature/AmazingPageComponent`
8. 提交 Pull Request

## 页面组件维护

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

## 页面组件废弃流程

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

## 页面组件迁移指南

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

## 页面组件最佳实践

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

## 页面组件生态系统

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

## 页面组件未来规划

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

本页面组件文档提供了页面组件开发、使用、测试、维护的全面指南，旨在帮助开发者更好地理解和使用页面组件，提高页面组件开发效率和质量。

页面组件文档将持续更新，以反映页面组件的最新状态和最佳实践。

---

**更新时间**：2025-12-01
**版本**：v0.0.0