declare namespace June_Sidebar {

    // 定义分类信息接口
    type CategoryInfo = {
        name: string;
        count: number;
    }

    // 定义侧边栏属性接口
    type SidebarProps = {
        isFixed: boolean;
        onCategorySelect: (category: string) => void;
        selectedCategory: string;
        categories: CategoryInfo[];
        toc?: June_Index.TocItem[];
        parentIds?: string[];
        onParentIdsUpdate: (parentIds: string[]) => void;
        onPageChange: (page: string) => void;
        onTimelineToggle?: () => void;
    }
}
