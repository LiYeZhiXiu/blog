declare namespace June_ArticleList {

    // ArticleList组件的Props接口定义
    type ComponentProps = {
        articles: Article[];
        onArticleClick: (article: Article) => void;
        onCategorySelect: (category: string) => void;
        onTagSelect: (tag: string) => void;
    }

}
