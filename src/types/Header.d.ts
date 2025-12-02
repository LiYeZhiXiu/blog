declare namespace June_Header {

    // 定义Header组件的属性接口
    type HeaderProps = {
        onBack?: () => void;
        onOpenSearchModal?: () => void;
        onCategorySelect?: (category: string) => void;
        onTimelineToggle?: () => void;
        showTimeline?: boolean;
        activePage?: string;
        onPageChange?: (page: string) => void;
    }

    // 定义Header组件的状态接口
    type HeaderState = {
        mobileMenuOpen: boolean;
        searchQuery: string;
    }
}
