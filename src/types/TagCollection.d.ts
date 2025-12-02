declare namespace June_TagCollection {
    // TagCollection组件的侧边栏属性接口定义
    type SidebarProps = {
        articles: Article[];
        onTagSelect: (tag: string) => void;
    }
}
