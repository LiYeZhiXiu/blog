declare namespace June_TimelineView {
    // TimelineView组件的侧边栏属性接口定义
    type SidebarProps = {
        articles: Article[];
        onArticleClick: (article: Article) => void;
    }
}
