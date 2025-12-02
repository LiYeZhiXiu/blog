import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.less';


/**
 * 博客头部组件
 * 包含导航栏、搜索框和移动端侧边栏功能
 */
class Header extends Component<June_Header.HeaderProps, June_Header.HeaderState> {
  /**
   * 组件状态
   */
  state: June_Header.HeaderState;

  /**
   * 进度条引用
   */
  progressBarRef = createRef<HTMLDivElement>();

  /**
   * 构造函数
   * @param props 组件属性
   */
  constructor(props: June_Header.HeaderProps) {
    super(props);
    this.state = {
      mobileMenuOpen: false,
      searchQuery: ''
    };
  }

  /**
   * 组件挂载时添加滚动监听并初始化进度条
   */
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    // 初始调用一次，确保进度条正确显示当前滚动位置
    this.handleScroll();
  }

  /**
   * 组件卸载时移除滚动监听
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * 处理滚动事件，更新进度条
   */
  handleScroll = () => {
    // 计算滚动进度
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / totalHeight) * 100 || 0;
    // 更新进度条宽度
    if (this.progressBarRef.current) {
      this.progressBarRef.current.style.width = `${progress}%`;
    }
  };

  /**
   * 切换移动端菜单显示状态
   */
  toggleMobileMenu = () => {
    this.setState(prevState => ({
      mobileMenuOpen: !(prevState as June_Header.HeaderState).mobileMenuOpen
    }));
  };

  /**
   * 关闭移动端菜单
   */
  closeMobileMenu = () => {
    this.setState({
      mobileMenuOpen: false
    });
  };

  /**
   * 处理搜索输入框按键事件
   * @param e 键盘事件对象
   */
  handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 如果提供了onOpenSearchModal，则打开搜索弹窗
    if (this.props.onOpenSearchModal) {
      e.preventDefault();
      this.props.onOpenSearchModal();
    } else if (e.key === 'Enter' && this.state.searchQuery.trim()) {
      // 否则使用URL参数方式
      const searchUrl = `/?keyword=${encodeURIComponent(this.state.searchQuery.trim())}`;
      window.location.href = searchUrl;
    }
  };

  /**
   * 处理搜索图标点击
   */
  handleSearchIconClick = () => {
    if (this.props.onOpenSearchModal) {
      this.props.onOpenSearchModal();
    }
  };

  /**
   * 处理搜索输入框内容变化
   * @param e 输入事件对象
   */
  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchQuery: e.target.value
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
   * 处理移动端导航项点击
   * @param page 页面标识
   */
  handleMobileNavItemClick = (page: string) => {
    this.closeMobileMenu();
    this.handlePageChange(page);
  };

  /**
   * 处理移动端文档下拉菜单点击
   * @param e 鼠标事件对象
   */
  handleMobileDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    el.classList.toggle('active');
  };

  render() {
    const { onBack, showTimeline, activePage = 'home' } = this.props;
    const { mobileMenuOpen, searchQuery } = this.state;

    return (
      <>
        <header className="blog-header">
          {/* 滚动进度条 */}
          <div className="progress-bar">
            <div className="progress" ref={this.progressBarRef}></div>
          </div>
          <div className="header-container">
            <div className="right-content">
              <div className="logo">
                <Link to="/" className="logo-link">
                  <h1 data-text="HUYIMIN">HUYIMIN</h1>
                </Link>
              </div>

              {/* 移动端汉堡菜单按钮 */}
              <button
                className="hamburger-menu"
                onClick={this.toggleMobileMenu}
                aria-label="菜单"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              {onBack ? (
                <button className="back-button" onClick={onBack}>
                  &larr; 返回
                </button>
              ) : (
                <nav className="nav">
                  <ul className="nav-list">
                    <li className="nav-item">
                      <Link
                        to="/"
                        className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                        onClick={() => this.handlePageChange('home')}
                      >
                        <span className="nav-icon1">🏠</span> 首页
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
                      <a className={"nav-link dropdown-toggle " + (activePage === 'archives' || activePage === 'tags' ? 'active' : '')}>
                        <span className="nav-icon1">🧭</span> 文档
                      </a>
                      <div className="dropdown-menu">
                        <Link
                          to="/archives"
                          className={`dropdown-item ${activePage === 'archives' ? 'active' : ''}`}
                          onClick={() => this.handlePageChange('archives')}
                        >
                          <span className="dropdown-icon">📚</span> 归档
                        </Link>
                        <Link
                          to="/tags"
                          className={`dropdown-item ${activePage === 'tags' ? 'active' : ''}`}
                          onClick={() => this.handlePageChange('tags')}
                        >
                          <span className="dropdown-icon">🏷️</span> 标签
                        </Link>
                        {/* <Link 
                          to="/notes" 
                          className={`dropdown-item ${activePage === 'notes' ? 'active' : ''}`}
                          onClick={() => this.handlePageChange('notes')}
                        >
                          <span className="dropdown-icon">📝</span> 笔记
                        </Link> */}
                      </div>
                    </li>
                    <li className="nav-item dropdown">
                      <a className={"nav-link dropdown-toggle " + (activePage === 'link' || activePage === 'tags' ? 'active' : '')}>
                        <span className="nav-icon1">🧭</span> 社交
                      </a>
                      <div className="dropdown-menu">
                        <Link
                          to="/link"
                          className={`dropdown-item ${activePage === 'link' ? 'active' : ''}`}
                          onClick={() => this.handlePageChange('link')}
                        >
                          <span className="dropdown-icon">📚</span> 友链
                        </Link>
                        <Link
                          to="/comment"
                          className={`dropdown-item ${activePage === 'comment' ? 'active' : ''}`}
                          onClick={() => this.handlePageChange('comment')}
                        >
                          <span className="dropdown-icon">🏷️</span> 留言
                        </Link>
                      </div>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/about"
                        className={`nav-link ${activePage === 'about' ? 'active' : ''}`}
                        onClick={() => this.handlePageChange('about')}
                      >
                        <span className="nav-icon1">👤</span> 关于
                      </Link>
                    </li>
                  </ul>
                </nav>
              )}
            </div>

            <div className="search">
              <input
                type="text"
                placeholder="搜索..."
                className="search-input"
                value={searchQuery}
                onChange={this.handleSearchChange}
                onKeyPress={this.handleSearch}
                onClick={this.handleSearchIconClick}
                readOnly={!!this.props.onOpenSearchModal}
                aria-label="搜索输入框"
              />
              {/* <button 
                className="search-button"
                onClick={this.handleSearchIconClick}
                aria-label="搜索"
              >
                🔍
              </button> */}
            </div>
          </div>
        </header>

        {/* 移动端侧边栏导航 */}
        <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <div className="logo">
              <Link to="/" className="logo-link">
                <h1>HUYIMIN</h1>
              </Link>
            </div>
            <button
              className="mobile-close-button"
              onClick={this.closeMobileMenu}
              aria-label="关闭"
            >
              ×
            </button>
          </div>
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link
                to="/"
                className={`mobile-nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => this.handleMobileNavItemClick('home')}
              >
                <span className="nav-icon1">🏠</span> 首页
              </Link>
            </li>
            <li className="mobile-nav-item mobile-dropdown">
              <div
                className="mobile-dropdown-header"
                onClick={this.handleMobileDropdownClick}
              >
                <a href="#" className="mobile-nav-link">
                  <span className="nav-icon1">🧭</span> 文档
                </a>
                <span className="mobile-dropdown-arrow">▼</span>
              </div>
              <div className="mobile-dropdown-menu">
                <Link
                  to="/timeline"
                  className={`mobile-dropdown-item ${activePage === 'categories' && showTimeline ? 'active' : ''}`}
                  onClick={() => {
                    this.closeMobileMenu();
                    this.handleCategoryListClick({ preventDefault: () => { } } as React.MouseEvent);
                  }}
                >
                  <span className="dropdown-icon">📚</span> 分类列表
                </Link>
                <Link
                  to="/tags"
                  className="mobile-dropdown-item"
                  onClick={() => this.handleMobileNavItemClick('tags')}
                >
                  <span className="dropdown-icon">🏷️</span> 文章标签
                </Link>
                <Link
                  to="/notes"
                  className="mobile-dropdown-item"
                  onClick={() => this.handleMobileNavItemClick('notes')}
                >
                  <span className="dropdown-icon">📝</span> 个人笔记
                </Link>
              </div>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/tags"
                className={`mobile-nav-link ${activePage === 'tags' ? 'active' : ''}`}
                onClick={() => this.handleMobileNavItemClick('tags')}
              >
                <span className="nav-icon1">🏷️</span> 标签
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/archive"
                className={`mobile-nav-link ${activePage === 'archive' ? 'active' : ''}`}
                onClick={() => this.handleMobileNavItemClick('archive')}
              >
                <span className="nav-icon1">🗂️</span> 归档
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link
                to="/about"
                className={`mobile-nav-link ${activePage === 'about' ? 'active' : ''}`}
                onClick={() => this.handleMobileNavItemClick('about')}
              >
                <span className="nav-icon1">👤</span> 关于
              </Link>
            </li>
          </ul>
        </nav>

        {/* 移动端遮罩层 */}
        <div
          className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={this.closeMobileMenu}
        />
      </>
    );
  }
}

export default Header;