declare namespace June_SearchModal {

    // SearchModal组件的文章接口定义
    type Article = {
        id: string;
        title: string;
        content: string;
        excerpt: string;
        date: string;
        tags: string[];
        category: string;
        summary?: string;
    }

    // SearchModal组件的Props接口定义
    type ComponentProps = {
        isOpen: boolean;
        onClose: () => void;
        articles: Article[];
        onArticleClick: (article: Article, keyword: string) => void;
        onTagSelect: (tag: string) => void;
    }

    // SearchModal组件的State接口定义S
    type ComponentState = {
        searchQuery: string;
        searchResults: {
            articles: Article[];
            pages: Article[];
            tags: string[];
        };
        activeTab: '全部' | '文章' | '页面' | '标签';
    }

}
