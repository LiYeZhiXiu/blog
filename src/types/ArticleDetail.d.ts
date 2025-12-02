declare namespace June_ArticleDetail {

    // ArticleDetail组件的文章接口定义
    type ComponentProps = {
        article: Article;
        onBack: () => void;
        searchKeyword?: string;
        onCategorySelect: (category: string) => void;
        onTagSelect: (tag: string) => void;
        onTocUpdate?: (toc: June_Index.TocItem[]) => void;
        onParentIdsUpdate?: (parentIds: string[]) => void;
    }

    // ArticleDetail组件的State接口定义
    type ComponentState = {
        fullscreenImage: string | null;
        allImages: string[];
        currentImageIndex: number;
        scale: number;
        rotation: number;
        flipHorizontal: boolean;
        flipVertical: boolean;
        isDragging: boolean;
        positionX: number;
        positionY: number;
        startX: number;
        startY: number;
    }
}
