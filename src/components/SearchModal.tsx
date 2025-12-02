import React, { Component, createRef } from 'react';
import '../css/SearchModal.less';

class SearchModal extends Component<June_SearchModal.ComponentProps, June_SearchModal.ComponentState> {
  searchInputRef = createRef<HTMLInputElement>();

  constructor(props: June_SearchModal.ComponentProps) {
    super(props);
    this.state = {
      searchQuery: '',
      searchResults: {
        articles: [],
        pages: [],
        tags: []
      },
      activeTab: '全部'
    };
  }

  // 当弹窗打开时，自动聚焦到搜索框
  componentDidUpdate(prevProps: June_SearchModal.ComponentProps) {
    if (this.props.isOpen && !prevProps.isOpen && this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }

    // 处理搜索逻辑
    if (prevProps.articles !== this.props.articles || prevProps.isOpen !== this.props.isOpen) {
      this.performSearch();
    }
  }

  // 全局键盘事件监听
  componentDidMount() {
    document.addEventListener('keydown', this.globalHandleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.globalHandleKeyDown);
  }

  // 执行搜索逻辑
  performSearch = () => {
    const { searchQuery } = this.state;
    const { articles } = this.props;

    if (searchQuery.trim() === '') {
      this.setState({
        searchResults: {
          articles: [],
          pages: [],
          tags: []
        }
      });
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = {
      articles: [],
      pages: [],
      tags: new Set<string>()
    };

    articles.forEach(article => {
      const titleMatch = article.title.toLowerCase().includes(query);
      const excerptMatch = article.excerpt?.toLowerCase().includes(query) || false;
      const summaryMatch = article.summary?.toLowerCase().includes(query) || false;
      const contentMatch = article.content.toLowerCase().includes(query);
      const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(query));

      // 页面与文章的判断，这里简化处理
      const isPage = ['关于', '政策', '手册', '指南', '帮助'].some(word =>
        article.title.toLowerCase().includes(word)
      );

      if (titleMatch || excerptMatch || summaryMatch || contentMatch || tagMatch) {
        if (isPage) {
          (results.pages as June_SearchModal.Article[]).push(article);
        } else {
          (results.articles as June_SearchModal.Article[]).push(article);
        }

        // 收集匹配的标签
        if (tagMatch) {
          article.tags.forEach(tag => {
            if (tag.toLowerCase().includes(query)) {
              results.tags.add(tag);
            }
          });
        }
      }
    });

    this.setState({
      searchResults: {
        articles: results.articles,
        pages: results.pages,
        tags: Array.from(results.tags)
      }
    });
  };

  // 处理搜索输入变化
  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: e.target.value }, this.performSearch);
  };

  // 处理清空搜索输入框
  handleClearSearch = () => {
    this.setState({ searchQuery: '' });
    // 清空后重新聚焦到输入框
    if (this.searchInputRef.current) {
      this.searchInputRef.current.focus();
    }
  };

  // 处理键盘事件
  handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  };

  // 全局键盘事件处理
  globalHandleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.props.isOpen) {
      this.props.onClose();
    }
  };

  // 高亮关键字函数
  highlightKeyword = (text: string | undefined, keyword: string) => {
    if (!text || !keyword.trim()) {
      return text || '';
    }

    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part)
        ? <mark key={index} className="highlight-keyword">{part}</mark>
        : part
    );
  };

  // 渲染搜索结果
  renderResults = () => {
    const { searchQuery, searchResults, activeTab } = this.state;
    const { onArticleClick, onClose, onTagSelect } = this.props;

    if (!searchQuery.trim()) {
      return (
        <div className="search-placeholder">
          <p>请输入搜索关键词</p>
        </div>
      );
    }

    const totalResults = searchResults.articles.length + searchResults.pages.length + searchResults.tags.length;

    if (totalResults === 0) {
      return (
        <div className="search-no-results">
          <p>未找到相关结果</p>
        </div>
      );
    }

    return (
      <div className="search-results">
        <div className="search-results-header">
          <p>找到 {totalResults} 个相关结果</p>
        </div>

        {(activeTab === '全部' || activeTab === '页面') && searchResults.pages.length > 0 && (
          <div className="search-results-section">
            <h3>页面 ({searchResults.pages.length})</h3>
            <div className="search-results-list">
              {searchResults.pages.map(article => (
                <div
                  key={article.id}
                  className="search-result-item"
                  onClick={() => {
                    onArticleClick(article, searchQuery);
                    onClose();
                  }}
                >
                  <h4>{this.highlightKeyword(article.title, searchQuery)}</h4>
                  <p className="search-result-meta">{article.date}</p>
                  <p className="search-result-excerpt">
                    {this.highlightKeyword(
                      (article.excerpt || article.summary || '').length > 150
                        ? (article.excerpt || article.summary)?.substring(0, 150) + '...'
                        : (article.excerpt || article.summary),
                      searchQuery
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === '全部' || activeTab === '文章') && searchResults.articles.length > 0 && (
          <div className="search-results-section">
            <h3>文章 ({searchResults.articles.length})</h3>
            <div className="search-results-list">
              {searchResults.articles.map(article => (
                <div
                  key={article.id}
                  className="search-result-item"
                  onClick={() => {
                    onArticleClick(article, searchQuery);
                    onClose();
                  }}
                >
                  <h4>{this.highlightKeyword(article.title, searchQuery)}</h4>
                  <p className="search-result-meta">{article.date}</p>
                  <p className="search-result-excerpt">
                    {this.highlightKeyword(
                      (article.excerpt || article.summary || '').length > 150
                        ? (article.excerpt || article.summary)?.substring(0, 150) + '...'
                        : (article.excerpt || article.summary),
                      searchQuery
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === '全部' || activeTab === '标签') && searchResults.tags.length > 0 && (
          <div className="search-results-section">
            <h3>标签 ({searchResults.tags.length})</h3>
            <div className="search-tags-list">
              {searchResults.tags.map((tag, index) => (
                <span
                  key={index}
                  className="search-tag"
                  onClick={() => {
                    onClose();
                    onTagSelect(tag);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { searchQuery, activeTab } = this.state;

    if (!isOpen) return null;

    return (
      <div className="search-modal-overlay">
        {/* 搜索模态框添加与头部高度相等的上边距 */}
        <div className="search-modal" style={{ marginTop: '60px' }}>
          <div className="search-modal-header">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                ref={this.searchInputRef}
                type="text"
                placeholder="搜索..."
                className="search-input"
                value={searchQuery}
                onChange={this.handleSearchChange}
                onKeyDown={this.handleKeyDown}
              />
              {searchQuery && (
                <button
                  className="search-clear-button"
                  onClick={this.handleClearSearch}
                  aria-label="清空搜索"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              className="search-close-button"
              onClick={onClose}
              aria-label="关闭"
            >
              ✕
            </button>
          </div>

          <div className="search-tabs">
            <button
              className={`search-tab ${activeTab === '全部' ? 'active' : ''}`}
              onClick={() => this.setState({ activeTab: '全部' })}
            >
              全部
            </button>
            <button
              className={`search-tab ${activeTab === '文章' ? 'active' : ''}`}
              onClick={() => this.setState({ activeTab: '文章' })}
            >
              文章
            </button>
            <button
              className={`search-tab ${activeTab === '页面' ? 'active' : ''}`}
              onClick={() => this.setState({ activeTab: '页面' })}
            >
              页面
            </button>
            <button
              className={`search-tab ${activeTab === '标签' ? 'active' : ''}`}
              onClick={() => this.setState({ activeTab: '标签' })}
            >
              标签
            </button>
          </div>

          <div className="search-modal-content">
            {this.renderResults()}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchModal;