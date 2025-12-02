import React, { Component } from 'react';
import '../css/ArticleList.less';

// 将函数组件转换为类组件
class ArticleList extends Component<June_ArticleList.ComponentProps> {

  // 组件渲染方法
  render() {
    const { articles, onArticleClick, onCategorySelect, onTagSelect } = this.props;
    return (
      <div className="article-list">
        <div className="articles-container">
          {articles.map(article => (
            <article key={article.id} className="article-card">
              {article.imageUrl && (
                <div className="article-image">
                  <a href="#">
                    <img src={article.imageUrl} alt={article.title} />
                    <div className='view-detail-btn' onClick={(e) => {
                      e.preventDefault();
                      onArticleClick(article);
                    }}>查看详情</div>
                  </a>
                </div>
              )}
              <div className="card-content">
                <h2 className="card-title" onClick={(e) => {
                  e.preventDefault();
                  onArticleClick(article);
                }}>
                  {article.title}
                </h2>
                <p className="article-summary">{article.summary}</p>
                <div className="article-meta">
                  <div>
                    <span className="article-category" onClick={(e) => {
                      e.preventDefault();
                      onCategorySelect(article.category);
                    }}>{article.category}</span>
                  </div>
                  <div>
                    <span className="article-date">
                      {article.date}
                    </span>
                  </div>
                </div>
                <div className="article-tags1">
                  {article.tags.map((tag: string, index: number) => (
                    <a
                      key={index}
                      href="#"
                      className="tag"
                      onClick={(e) => {
                        e.preventDefault();
                        onTagSelect(tag);
                      }}
                    >{tag}</a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }
}

export default ArticleList;