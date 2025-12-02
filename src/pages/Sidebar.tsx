import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Sidebar.less';



/**
 * 侧边栏组件
 * 包含用户信息、文章分类、站内导航和文章目录
 */
class Sidebar extends Component<June_Sidebar.SidebarProps, { githubUsername: string }> {
  /**
   * 用户信息区域的引用
   */
  userProfileRef: React.RefObject<HTMLDivElement>;
  
  /**
   * 侧边栏的引用
   */
  sidebarRef: React.RefObject<HTMLElement>;
  
  /**
   * 是否展开单分类模式
   */
  expandMode: boolean;
  
  /**
   * 构造函数
   * @param props 组件属性
   */
  constructor(props: June_Sidebar.SidebarProps) {
    super(props);
    this.userProfileRef = React.createRef<HTMLDivElement>();
    this.sidebarRef = React.createRef<HTMLElement>();
    this.expandMode = true;
    
    // 初始化状态，从localStorage读取GitHub用户名
    this.state = {
      githubUsername: localStorage.getItem('githubUsername') || 'HUYIMIN'
    };
  }
  
  /**
   * 处理GitHub登录功能
   * @param e 点击事件对象
   */
  handleGithubLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    // 这里可以实现GitHub OAuth登录流程
    // 实际项目中需要配置GitHub OAuth应用并获取client_id
    const clientId = 'Iv23liNlqYvTghwgqLx2'; // 需要替换为实际的client_id
    const redirectUri = encodeURIComponent(window.location.origin + '/callback');
    const scope = 'user'; // 申请的权限范围
    console.log(clientId, redirectUri, scope);
    // 模拟登录流程（实际项目中应该重定向到GitHub OAuth页面）
    // if (clientId === 'Iv23liNlqYvTghwgqLx2') {
    //   // 为了演示，模拟登录成功并设置一个示例用户名
    //   this.handleGitHubLoginSuccess('DemoUser');
    //   return;
    // }
    
    // 重定向到GitHub OAuth授权页面
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  /**
   * 处理GitHub登录成功
   * @param username GitHub用户名
   */
  handleGitHubLoginSuccess = (username: string) => {
    // 保存用户名到localStorage
    // localStorage.setItem('githubUsername', username);
    // 更新状态
    this.setState({ githubUsername: username });
  };

  /**
   * 解析URL中的查询参数
   * @returns 查询参数对象
   */
  parseQueryParams = (): { [key: string]: string } => {
    const params: { [key: string]: string } = {};
    const queryString = window.location.search.substring(1);
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    
    return params;
  };
  
  /**
   * 组件挂载时添加事件监听
   */
  componentDidMount() {
    // 监听窗口大小变化，处理响应式布局
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    // 检查是否是GitHub OAuth回调
    this.handleOAuthCallback();
  }

  /**
   * 处理窗口大小变化
   * 用于响应式布局调整
   */
  handleResize = () => {
    // 根据窗口宽度调整侧边栏的展开状态
    if (window.innerWidth < 768) {
      this.expandMode = false;
    } else {
      this.expandMode = true;
    }
    // 触发重渲染
    this.forceUpdate();
  };

  /**
   * 处理GitHub OAuth回调
   */
  handleOAuthCallback = async () => {
    const params = this.parseQueryParams();
    
    // 检查是否有code参数（OAuth授权码）
    if (params.code) {
      try {
        // 实际项目中，这里应该向后端发送请求，用code换取access_token
        // 然后使用access_token获取用户信息
        
        // 模拟获取用户信息的过程
        // const response = await fetch('/api/github/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code: params.code })
        // });
        // const data = await response.json();
        
        // 为了演示，使用示例用户名
        const demoUsername = 'GitHubUser';
        this.handleGitHubLoginSuccess(demoUsername);
        
        // 清除URL中的code参数
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        window.history.pushState({}, document.title, url.pathname);
      } catch (error) {
        console.error('GitHub登录失败:', error);
      }
    }
  }

  /**
   * 将扁平的toc数组转换为嵌套结构
   * 子分类存储在父分类的childItem属性中
   * @param flatToc 扁平的toc数组
   * @returns 嵌套结构的toc数组
   */
  convertToNestedToc = (flatToc: June_Index.TocItem[]): June_Index.TocItem[] => {
    if (!flatToc || flatToc.length === 0) return [];

    // 复制原始数组，避免修改原数据
    const items = [...flatToc];
    const rootItems: June_Index.TocItem[] = [];
    const itemMap = new Map<string, June_Index.TocItem>();

    // 先创建所有项目的映射
    items.forEach(item => {
      itemMap.set(item.id, { ...item, childItem: [] });
    });
    
    // 构建嵌套结构
    items.forEach(item => {
      const currentItem = itemMap.get(item.id)!;
      let parentItem = null;

      // 查找父项：向前遍历，找到第一个级别比当前项低的项目
      for (let i = items.indexOf(item) - 1; i >= 0; i--) {
        const potentialParent = items[i];
        if (potentialParent.level < item.level) {
          parentItem = itemMap.get(potentialParent.id);
          break;
        }
      }

      if (parentItem) {
        // 是子项，添加到父项的childItem中
        if (!parentItem.childItem) {
          parentItem.childItem = [];
        }
        parentItem.childItem.push(currentItem);
      } else {
        // 是根项，直接添加到根数组
        rootItems.push(currentItem);
      }
    });

    return rootItems;
  };

  /**
   * 点击目录项时滚动到对应位置并展开父分类
   * @param item 目录项
   * @param e 鼠标事件对象
   */
  scrollToElement = (item: June_Index.TocItem, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(item.id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollToY = window.pageYOffset + rect.top - rect.height - 50;
      window.scrollTo({
        top: scrollToY,
        behavior: 'smooth'
      });
    }
    
    // 展开有子项的父分类
    console.log('1----------');
    
    const { parentIds, onParentIdsUpdate } = this.props;
    const toc = this.props.toc || [];
    const nestedToc = this.convertToNestedToc(toc);
    
    // 展开单分类
    if (this.expandMode && nestedToc.length > 0) {
      // 计算要更新的父分类ID列表
      const updatedIds = parentIds?.includes(item.id)
        ? parentIds.filter(id => id !== item.id)
        : [...(parentIds || []).slice(0, item.level - nestedToc[0].level), item.id];

      // 直接调用回调函数，传递更新后的数组
      onParentIdsUpdate(updatedIds);
      return;
    }
    
    if (item.childItem && item.childItem.length > 0) {
      // 展开多分类
      // 计算要更新的父分类ID列表
      const updatedIds = parentIds?.includes(item.id)
        ? parentIds.filter(id => id !== item.id)
        : [...(parentIds || []), item.id];

      // 直接调用回调函数，传递更新后的数组
      onParentIdsUpdate(updatedIds);
    }
  };

  /**
   * 递归渲染目录项及其子项
   * @param items 目录项数组
   * @returns 渲染后的JSX元素数组
   */
  renderTocItems = (items: June_Index.TocItem[]) => {
    // const { parentIds } = this.props;
    
    return items.map((item) => {
      const hasChildren = item.childItem && item.childItem.length > 0;
      // 分类状态类名
      const isParentCategory = hasChildren;
      const isExpanded = false;

      return (
        <li key={item.id} className={`toc-item level-${item.level} ${isParentCategory ? 'parent-category' : 'child-category'}`}>
          <div className={`toc-item-wrapper ${isExpanded ? 'active1' : ''}`} onClick={(e) => this.scrollToElement(item, e)}>
            {/* 目录项链接 */}
            <Link
              to={`#${item.id}`}
              className={`toc-link ${isExpanded ? 'active' : ''}`}
            >
              {item.title}
            </Link>
          </div>

          {/* 递归渲染子项（如果有子项且已展开） */}
          {hasChildren && (
            <ul className="toc-child">
              {this.renderTocItems(item.childItem!)}
            </ul>
          )}
        </li>
      );
    });
  };

  /**
   * 处理分类列表点击
   * @param e 鼠标事件对象
   */
  handleCategoryListClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 直接触发时间轴视图切换
    if (this.props.onTimelineToggle) {
      this.props.onTimelineToggle();
    }
  };

  /**
   * 处理页面变化
   * @param page 页面标识
   */
  handlePageChange = (page: string) => {
    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }
  };

  /**
   * 渲染组件
   */
  render() {
    const { 
      onCategorySelect, 
      selectedCategory, 
      categories, 
      toc = [], 
    } = this.props;
    
    // 转换toc数据为嵌套结构
    const nestedToc = this.convertToNestedToc(toc);

    return (
      <aside ref={this.sidebarRef} className={`sidebar`}>
        <div className="sidebar-content" id="sidebar-content">
          {/* 用户信息区域 */}
          {!toc.length && (
            <div ref={this.userProfileRef} className="user-profile">
              <div className="avatar-container">
                <div className="avatar">
                  <svg viewBox="0 0 100 100" width="80" height="80">
                    <circle cx="50" cy="50" r="45" fill="#f0f0f0" />
                    {/* <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#666">HUYIMIN</text> */}
                  </svg>
                </div>
              </div>
              <h3 className="username">{this.state.githubUsername}</h3>
              <p className="user-bio">言语温柔，李格伯纳。</p>
              <div className="social-links">
                <Link to="#" className="social-icon" onClick={(e) => this.handleGithubLogin(e)}>
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </Link>
                <Link to="#" className="social-icon">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </Link>
                <Link to="#" className="social-icon">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          <div className='sticky_layout'>
            {/* 文章分类 - 仅当没有toc（非文章内容页面）时显示 */}
            {!toc.length && (
              <div className="sidebar-section">
                <h3 className="section-title">
                  <span>文章分类</span>
                  <span className='category-count'>总数（{categories.reduce((total, cat) => total + cat.count, 0)}）</span>
                </h3>
                <ul className="category-list">
                  {/* 动态渲染实际存在的分类 */}
                  {categories.map((category) => (
                    <li key={category.name} className={selectedCategory === category.name ? 'active' : ''}>
                      <Link
                        to={`/category/${category.name}`}
                        className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onCategorySelect(category.name);
                        }}
                      >
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">({category.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 本文目录 */}
            {nestedToc && nestedToc.length > 0 && (
              <div className="sidebar-section toc-section" style={{ marginTop: !toc.length ? '15px' : '0' }}>
                <h3 className="section-title">本文目录</h3>
                <ul className="toc-list">
                  {this.renderTocItems(nestedToc)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </aside>
    );
  }
}

export default Sidebar;