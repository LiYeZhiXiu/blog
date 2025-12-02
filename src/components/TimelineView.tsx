import React, { Component } from 'react';
import '../css/TimelineView.less';
import type { Article } from '../mock/articles';

/**
 * 时间轴视图组件
 * 用于以时间轴形式展示文章，按年份分组并排序
 */
class TimelineView extends Component<June_TimelineView.SidebarProps> {
  /**
   * 处理文章点击事件
   * @param e 鼠标事件对象
   * @param article 被点击的文章对象
   */
  handleArticleClick = (e: React.MouseEvent, article: Article) => {
    e.preventDefault();
    this.props.onArticleClick(article);
  };

  /**
   * 对文章按日期降序排序
   * @returns 排序后的文章数组
   */
  getSortedArticles = (): Article[] => {
    return [...this.props.articles].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  /**
   * 按年份分组文章
   * @returns 按年份分组的文章对象
   */
  getArticlesByYear = (): Record<string, Article[]> => {
    const articlesByYear: Record<string, Article[]> = {};
    const sortedArticles = this.getSortedArticles();

    // 按年份分组
    sortedArticles.forEach(article => {
      const year = new Date(article.date).getFullYear();
      if (!articlesByYear[year]) {
        articlesByYear[year] = [];
      }
      articlesByYear[year].push(article);
    });

    return articlesByYear;
  };

  /**
   * 获取排序后的年份列表（降序）
   * @returns 排序后的年份字符串数组
   */
  getSortedYears = (): string[] => {
    const articlesByYear = this.getArticlesByYear();
    return Object.keys(articlesByYear).sort((a, b) => parseInt(b) - parseInt(a));
  };

  /**
   * 格式化日期为 MM-DD 格式
   * @param dateString 日期字符串
   * @returns 格式化后的日期字符串
   */
  formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  render() {
    const years = this.getSortedYears();
    const articlesByYear = this.getArticlesByYear();

    return (
      <div className="timeline-view">
        {years.map(year => (
          <div key={year} className="timeline-year-group">
            <h2 className="timeline-year">{year}</h2>
            {articlesByYear[year].map(article => (
              <div key={article.id} className='timenode'>
                <a 
                  href={`/article/${article.id}`}
                  className="meta"
                  onClick={(e) => this.handleArticleClick(e, article)}
                >
                  <time dateTime={article.date}>{this.formatDate(article.date)}</time>
                  <span className="title-text">{article.title}</span>
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default TimelineView;