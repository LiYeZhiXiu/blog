import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/TagCollection.less';


/**
 * 标签集合组件
 * 用于展示文章的标签，点击标签可以筛选文章
 */
class TagCollection extends Component<June_TagCollection.SidebarProps> {

    // 处理标签点击事件
    handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.preventDefault();
        this.props.onTagSelect(tag);
    };

    // 获取所有标签并去重
    getUniqueTags = (): string[] => {
        // 提取所有标签
        const allTags = this.props.articles.flatMap(article => article.tags);
        // 去重
        return Array.from(new Set(allTags));
    };

    // 获取标签出现次数
    getTagCount = (tag: string): number => {
        return this.props.articles.flatMap(article => article.tags).filter(t => t === tag).length;
    };

    render() {
        const uniqueTags = this.getUniqueTags();

        return (
            <div className="tag-collection">
                <h2>所有标签</h2>
                <div className='all-tags'>
                    <div className='tag-list'>
                        {
                            uniqueTags.map((tag, index) => (
                                <div className='tag-list-item' key={index}>
                                    <Link
                                        to={'/tags/' + tag}
                                        className="tag-list-link"
                                        onClick={(e) => this.handleTagClick(e, tag)}
                                    >
                                        {tag}
                                    </Link>
                                    <span className='tag-list-count'>
                                        x{this.getTagCount(tag)}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default TagCollection;