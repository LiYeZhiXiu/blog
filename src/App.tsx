import React, { Component, createRef } from 'react'
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
import Header from './pages/Header'
import Sidebar from './pages/Sidebar'
import ArticleList from './components/ArticleList'
import ArticleDetail from './components/ArticleDetail'
import Footer from './pages/Footer'
import TimelineView from './components/TimelineView'
import TagCollection from './components/TagCollection'
import './App.less';
import SearchModal from './components/SearchModal';
import MouseTrail from './components/MouseTrail';
import type { Article } from './mock/articles'

// 文章详情页组件（类组件版本）
class ArticleDetailPageClass extends Component<{
  articles: Article[],
  onBack: () => void,
  onCategorySelect: (category: string) => void,
  onTagSelect: (tag: string) => void,
  searchKeyword: string,
  onTocUpdate: (toc: June_Index.TocItem[]) => void,
  onParentIdsUpdate: (parentIds: string[]) => void,
  params: { id: string }
}> {
  render() {
    const { id } = this.props.params;
    const article = this.props.articles.find(a => a.id === Number(id)) || null;

    if (!article) {
      return <div className="error">文章不存在</div>;
    }

    return (
      <ArticleDetail
        article={article}
        onBack={this.props.onBack}
        onCategorySelect={this.props.onCategorySelect}
        onTagSelect={this.props.onTagSelect}
        searchKeyword={this.props.searchKeyword}
        onTocUpdate={this.props.onTocUpdate}
        onParentIdsUpdate={this.props.onParentIdsUpdate}
      />
    );
  }
}

// 为类组件创建路由包装器
function withRouterWrapper<P extends object>(Component: React.ComponentClass<P>) {
  return function WithRouterWrapper(props: Omit<P, keyof June_Index.RouteComponentProps>) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return <Component {...(props as P)} location={location} navigate={navigate} params={params} />;
  };
}

// 为ArticleDetailPage添加路由
const ArticleDetailPage = withRouterWrapper(ArticleDetailPageClass);

// 主内容组件（类组件版本）
class MainContentClass extends Component<June_Index.RouterProps> {
  // 侧边栏是否固定
  private isFixed: boolean = false;
  // 页面大小
  private pageSize: number = 5;
  // 用于存储定时器ID的ref
  private pageTimerRef = createRef<number | null>();
  constructor(props: June_Index.RouterProps) {
    super(props);
  }
  // 组件状态 - 直接初始化一些测试文章数据
  state = {
    selectedCategory: '',
    selectedTag: '', // 添加选中标签状态
    articles: ([
      {
        id: 1,
        title: '测试文章 1',
        date: '2024-10-01',
        summary: '这是一篇测试文章的摘要内容，用于确保首页能正常显示文章列表。',
        content: '<h2>测试文章内容</h2><p>这是测试文章的详细内容。</p>',
        category: '测试',
        tags: ['测试', '示例'],
        imageUrl: 'https://picsum.photos/id/180/800/400'
      },
      {
        id: 2,
        title: '测试文章 2',
        date: '2024-10-02',
        summary: '这是第二篇测试文章的摘要内容。',
        content: '<h2>测试文章内容 2</h2><p>这是第二篇测试文章的详细内容。</p>',
        category: '测试',
        tags: ['测试', '示例2'],
        imageUrl: 'https://picsum.photos/id/181/800/400'
      }
    ] as Article[]),
    loading: false, // 初始设置为false，因为我们已经有了一些测试数据
    currentPage: 1,
    showBackToTop: false,
    searchQuery: '',
    searchModalOpen: false,
    currentToc: [] as June_Index.TocItem[],
    selectedArticle: null as Article | null,
    showTimeline: false,
    parentIds: [] as string[],
    activePage: 'home', // 当前活动页面: home, categories, tags, archive, about
    articlesLoaded: true // 初始设置为true
  };

  // 组件挂载时执行
  componentDidMount() {
    // 从URL获取搜索参数
    this.handleUrlSearchParams();

    // 立即加载文章数据
    this.loadArticles();

    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll);

    // 确保组件挂载后有数据显示
    if (this.state.articles.length === 0) {
      console.log('初始加载时没有文章数据，尝试立即加载');
      this.loadArticles();
    }
  }

  // 组件卸载时执行
  componentWillUnmount() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll);

    // 清除定时器
    if (this.pageTimerRef.current) {
      clearTimeout(this.pageTimerRef.current);
    }
  }

  // 从URL获取搜索参数
  handleUrlSearchParams = () => {
    const urlParams = new URLSearchParams(this.props.location.search);
    const keyword = urlParams.get('keyword');

    // 只有当搜索关键词发生变化时才更新状态
    if (keyword !== this.state.searchQuery) {
      if (keyword) {
        this.setState({
          searchQuery: keyword,
          currentPage: 1, // 搜索时重置到第一页
          selectedArticle: null, // 退出文章详情页
          selectedCategory: '', // 搜索时清除分类选择
          activePage: 'home' // 搜索时设置活动页面为首页
        });
      } else if (this.state.searchQuery) {
        this.setState({ searchQuery: '' });
      }
    }
  };

  // 加载文章数据
  loadArticles = async () => {
    try {
      this.setState({ loading: true });
      // 尝试加载真实的模拟数据
      try {
        const { articles: mockArticles } = await import('./mock/articles');
        console.log('直接导入的模拟文章数据:', mockArticles);
        if (mockArticles && mockArticles.length > 0) {
          this.setState({
            articles: mockArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            articlesLoaded: true
          }, () => {
            console.log('成功加载到真实模拟数据，文章数量:', this.state.articles.length);
          });
        } else {
          console.log('未找到有效模拟数据，保持现有测试数据');
        }
      } catch {
        console.log('无法导入模拟数据，使用现有测试数据');
      }
    } catch (error) {
      console.error('加载文章数据时出现错误:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  // 处理滚动事件
  handleScroll = () => {
    if (window.scrollY > 100) {
      if (!this.state.showBackToTop)
        this.setState({ showBackToTop: true });
    } else {
      if (this.state.showBackToTop)
        this.setState({ showBackToTop: false });
    }
  };

  // 处理搜索弹窗的打开和关闭
  handleOpenSearchModal = () => {
    this.setState({ searchModalOpen: true });
  };

  handleCloseSearchModal = () => {
    this.setState({ searchModalOpen: false });
  };

  // 处理从搜索弹窗中选择文章
  handleSearchArticleClick = (article: Article, keyword: string) => {
    this.setState({
      selectedArticle: article,
      searchModalOpen: false,
      searchQuery: keyword // 设置搜索关键字，用于文章详情页高亮
    }, () => {
      // 导航到文章详情页
      this.props.navigate(`/article/${article.id}`);
    });
  };

  // 回到顶部
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 切换分页
  handlePaginationChange = (page: number) => {
    const { totalPages } = this;

    if (page >= 1 && page <= totalPages) {
      this.setState({ currentPage: page });
      // 防抖：100ms 后无新翻页操作再滚动到顶部
      if (this.pageTimerRef.current) {
        clearTimeout(this.pageTimerRef.current);
      }
      this.pageTimerRef.current = window.setTimeout(() => this.scrollToTop(), 100) as unknown as number;
    }
  };

  // 处理分类选择
  handleCategorySelect = (category: string) => {
    console.log('选择分类:', category);
    this.props.navigate(`/category/${category||'全部'}`); // 导航到对应页面
    this.setState({
      selectedCategory: category,
      currentPage: 1, // 切换分类时重置到第一页
      selectedArticle: null, // 退出文章详情页
      showTimeline: false, // 分类选择时关闭时间轴视图
      activePage: 'home', // 设置活动页面为首页
      searchQuery: '', // 确保重置搜索条件
      selectedTag: '' // 重置标签选择
    }, () => {
      this.scrollToTop();
    });
  };

  // 处理标签选择
  handleTagSelect = (tag: string) => {
    console.log('选择标签:', tag);
    this.props.navigate(`/tags/${tag}`); // 导航到对应页面
    this.setState({
      selectedTag: tag,
      currentPage: 1, // 切换标签时重置到第一页
      selectedArticle: null, // 退出文章详情页
      showTimeline: false, // 标签选择时关闭时间轴视图
      activePage: 'home', // 设置活动页面为首页
      searchQuery: '', // 确保重置搜索条件
      selectedCategory: '' // 重置分类选择
    }, () => {
      this.scrollToTop();
    });
  };

  // 处理时间轴视图切换
  handleTimelineToggle = () => {
    this.props.navigate('/archives'); // 导航到时间轴路由
    this.setState({ activePage: 'categories' }, () => {
      this.scrollToTop();
    });
  };

  // 处理文章点击
  handleArticleClick = (article: Article) => {
    this.props.navigate(`/article/${article.id}`); // 导航到文章详情路由
    this.scrollToTop();
  };

  // 处理返回列表
  handleBackToList = () => {
    this.props.navigate('/'); // 导航到首页
    this.setState({
      currentToc: [], // 清除目录
      parentIds: [],
      activePage: 'home' // 返回时设置活动页面为首页
    }, () => {
      this.scrollToTop();
    });
  };

  // 处理页面切换
  handlePageChange = (page: string) => {
    this.props.navigate(`/${page === 'home' ? '' : page}`); // 导航到对应页面

    // 根据页面类型重置相关状态
    const newState: Partial<typeof this.state> = {
      activePage: page,
      currentPage: 1 // 重置到第一页
    };

    if (page === 'home') {
      newState.selectedCategory = '';
      newState.searchQuery = ''; // 重置搜索条件
    }

    this.setState(newState, () => {
      this.scrollToTop();
      
    });
  };

  // 处理目录更新
  handleTocUpdate = (toc: June_Index.TocItem[]) => {
    this.setState({ currentToc: toc });
  };

  // 处理父分类ID更新
  handleParentIdsUpdate = (parentIds: string[]) => {
    if (parentIds != this.state.parentIds)
      this.setState({ parentIds });
  };

  // 统计文章分类（getter方法）
  get categoryStats() {
    return this.state.articles.reduce((stats: Record<string, number>, article) => {
      if (!stats[article.category]) {
        stats[article.category] = 0;
      }
      stats[article.category]++;
      return stats;
    }, {});
  }

  // 分类信息数组并排序（getter方法）
  get categories() {
    return Object.entries(this.categoryStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // 筛选后的文章（getter方法）
  get filteredArticles() {
    const filtered = this.state.articles.filter(article => {
      // 检查是否匹配分类
      const categoryMatch = !this.state.selectedCategory || article.category === this.state.selectedCategory;

      // 检查是否匹配标签
      const tagMatch = !this.state.selectedTag || article.tags.includes(this.state.selectedTag);

      // 检查是否匹配搜索关键词
      const searchMatch = !this.state.searchQuery ||
        article.title.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(this.state.searchQuery.toLowerCase()));

      // 同时满足分类、标签和搜索条件
      return categoryMatch && tagMatch && searchMatch;
    });
    // console.log('筛选后的文章数量:', filtered.length);
    return filtered;
  }

  // 总页数（getter方法）
  get totalPages() {
    return Math.ceil(this.filteredArticles.length / this.pageSize);
  }

  // 当前页显示的文章（getter方法）
  get paginatedArticles() {
    const paginated = this.filteredArticles.slice(
      (this.state.currentPage - 1) * this.pageSize,
      this.state.currentPage * this.pageSize
    );
    // console.log('分页后的文章数量:', paginated.length);
    return paginated;
  }

  // 渲染组件
  render() {
    const {
      loading,
      showBackToTop,
      searchModalOpen,
      currentToc,
      parentIds,
      activePage,
      selectedCategory
    } = this.state;
    const { location } = this.props;

    return (
      <div className="blog-container">
        <Header
          onOpenSearchModal={this.handleOpenSearchModal}
          onCategorySelect={this.handleCategorySelect}
          onTimelineToggle={this.handleTimelineToggle}
          activePage={activePage}
          onPageChange={this.handlePageChange}
        />
        <div className="content-wrapper">
          <div className="sidebar-container">
            <Sidebar
              isFixed={this.isFixed}
              onCategorySelect={this.handleCategorySelect}
              selectedCategory={selectedCategory}
              categories={this.categories}
              toc={location.pathname.includes('/article/') ? currentToc : undefined}
              onParentIdsUpdate={this.handleParentIdsUpdate}
              parentIds={parentIds}
              onPageChange={this.handlePageChange}
              onTimelineToggle={this.handleTimelineToggle}
            />
          </div>
          <div className="main-content">
            {loading ? (
              <div className="loading">加载中...</div>
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                     <ArticleList
                        articles={this.paginatedArticles} // 传递分页后的文章数据，使分类选择生效
                        onArticleClick={this.handleArticleClick}
                        onCategorySelect={this.handleCategorySelect}
                        onTagSelect={this.handleTagSelect}
                      />
                  }
                />
                {/* 归档 */}
                <Route
                  path="/archives"
                  element={
                    <TimelineView
                      articles={this.state.articles}
                      onArticleClick={this.handleArticleClick}
                    />
                  }
                />
                {/* 文档详情页 */}
                <Route
                  path="/article/:id"
                  element={
                    <ArticleDetailPage
                      articles={this.state.articles}
                      onBack={this.handleBackToList}
                      onCategorySelect={this.handleCategorySelect}
                      onTagSelect={this.handleTagSelect}
                      searchKeyword={this.state.searchQuery}
                      onTocUpdate={this.handleTocUpdate}
                      onParentIdsUpdate={this.handleParentIdsUpdate}
                    />
                  }
                />
                {/* 标签页 */}
                <Route
                  path="/tags"
                  element={<TagCollection onTagSelect={this.handleTagSelect} articles={this.state.articles} />}
                />
                {/* 过滤后的文章列表 */}
                <Route
                  path="/tags/:tag"
                  element={
                    <ArticleList
                      articles={this.paginatedArticles} // 传递分页后的文章数据，使分类选择生效
                      onArticleClick={this.handleArticleClick}
                      onCategorySelect={this.handleCategorySelect}
                      onTagSelect={this.handleTagSelect}
                    />
                  }
                />
                <Route
                  path="/category/:category"
                  element={
                    <ArticleList
                      articles={this.paginatedArticles} // 传递分页后的文章数据，使分类选择生效
                      onArticleClick={this.handleArticleClick}
                      onCategorySelect={this.handleCategorySelect}
                      onTagSelect={this.handleTagSelect}
                    />
                  }
                />
                {/* 关于页 */}
                <Route
                  path="/about"
                  element={<div className="page-content">关于页</div>}
                />
              </Routes>
            )}
            {location.pathname === '/' && !loading && this.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => this.handlePaginationChange(this.state.currentPage - 1)}
                  disabled={this.state.currentPage === 1}
                >
                  上一页
                </button>
                <span className="page-info">{this.state.currentPage}/{this.totalPages}</span>
                <button
                  onClick={() => this.handlePaginationChange(this.state.currentPage + 1)}
                  disabled={this.state.currentPage === this.totalPages}
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
        <Footer />
        {showBackToTop && (
          <button className="back-to-top" onClick={this.scrollToTop}>
            ↑
          </button>
        )}
        <SearchModal
          isOpen={searchModalOpen}
          onClose={this.handleCloseSearchModal}
          articles={this.state.articles}
          onArticleClick={this.handleSearchArticleClick}
          onTagSelect={this.handleTagSelect}
        />
      </div>
    );
  }
}

// 为MainContent添加路由功能
const MainContent = withRouterWrapper(MainContentClass);

// 主App组件（类组件版本）
class App extends Component {
  render() {
    return (
      <>
        {/* 鼠标跟随效果组件 */}
        <MouseTrail />
        <MainContent />
      </>
    );
  }
}

export default App
