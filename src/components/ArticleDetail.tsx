import React, { Component, createRef } from 'react';
import '../css/ArticleDetail.less';


class ArticleDetail extends Component<June_ArticleDetail.ComponentProps, June_ArticleDetail.ComponentState> {
  // 引用
  contentRef = createRef<HTMLDivElement>();
  scrollTimeoutRef = { current: null as number | null };
  
  // 实例属性
  tocUpdated: boolean;
  
  // 防抖定时器ID
  debounceTimerId: ReturnType<typeof setTimeout> | null = null;
  
  // 构造函数
  constructor(props: June_ArticleDetail.ComponentProps) {
    super(props);
    
    // 初始化状态
    this.state = {
      fullscreenImage: null,
      allImages: [],
      currentImageIndex: 0,
      scale: 1,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      isDragging: false,
      positionX: 0,
      positionY: 0,
      startX: 0,
      startY: 0
    };
    
    // 初始化实例属性
    this.tocUpdated = false;
    
    // 绑定方法
    this.handleImageClick = this.handleImageClick.bind(this);
    this.nextImage = this.nextImage.bind(this);
    this.prevImage = this.prevImage.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.resetTransform = this.resetTransform.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
    this.flipImageHorizontal = this.flipImageHorizontal.bind(this);
    this.flipImageVertical = this.flipImageVertical.bind(this);
    this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.closeFullscreenImage = this.closeFullscreenImage.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  
  // 高亮关键字函数
  highlightKeyword(text: string, keyword: string): string {
    if (!keyword?.trim()) return text;

    // 使用正则表达式匹配关键字（不区分大小写）
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="highlight-keyword">$1</span>');
  }

  // 处理图片点击，进入全屏模式
  handleImageClick(imageSrc: string, index: number) {
    console.log('点击图片:', imageSrc, index);

    this.setState({
      fullscreenImage: imageSrc,
      currentImageIndex: index,
      // 重置变换状态
      scale: 1,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      positionX: 0,
      positionY: 0,
      isDragging: false
    });
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  }
  
  // 滚动到第一个匹配的关键字位置
  scrollToFirstKeyword(keyword?: string) {
    // 如果未传入 keyword，则尝试使用 props 中的 searchKeyword
    const searchKeyword = keyword || this.props.searchKeyword;
    if (!searchKeyword) return;

    // 确保内容容器已存在
    if (!this.contentRef.current) return;
    
    try {
      // 查找所有包含高亮关键字的元素
      const highlightedElements = this.contentRef.current.querySelectorAll(".highlight-keyword");
      
      if (highlightedElements.length > 0) {
        // 获取第一个匹配元素
        const firstMatch = highlightedElements[0] as HTMLElement;
        
        // 计算滚动位置，考虑页面顶部偏移
        const elementRect = firstMatch.getBoundingClientRect();
        const scrollOffset = 100; // 顶部留出的空间
        
        // 滚动到元素位置
        window.scrollTo({
          top: window.scrollY + elementRect.top - scrollOffset,
          behavior: 'smooth' // 平滑滚动
        });
        
        // 可选：聚焦到第一个匹配项以提高可见性
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 可选：短暂添加一个额外的高亮效果，使第一个匹配项更加突出
        firstMatch.classList.add('highlight-keyword-first');
        setTimeout(() => {
          firstMatch.classList.remove('highlight-keyword-first');
        }, 2000);
      }
    } catch (error) {
      console.error('滚动到关键字位置时出错:', error);
    }
  }

  // 切换到下一张图片
  nextImage(e?: React.MouseEvent) {
    e?.stopPropagation(); // 防止触发覆盖层的点击事件
    const { allImages, currentImageIndex } = this.state;
    if (allImages.length > 0) {
      const nextIndex = (currentImageIndex + 1) % allImages.length;
      this.setState({
        currentImageIndex: nextIndex,
        fullscreenImage: allImages[nextIndex],
        // 重置变换状态
        scale: 1,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        positionX: 0,
        positionY: 0,
        isDragging: false
      });
    }
  }

  // 切换到上一张图片
  prevImage(e?: React.MouseEvent) {
    e?.stopPropagation(); // 防止触发覆盖层的点击事件
    const { allImages, currentImageIndex } = this.state;
    if (allImages.length > 0) {
      const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
      this.setState({
        currentImageIndex: prevIndex,
        fullscreenImage: allImages[prevIndex],
        // 重置变换状态
        scale: 1,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        positionX: 0,
        positionY: 0,
        isDragging: false
      });
    }
  }

  // 放大图片
  zoomIn(e?: React.MouseEvent) {
    e?.stopPropagation();
    this.setState(prevState => ({
      scale: Math.min(prevState.scale + 0.2, 5),
      // 重置位置为中心
      positionX: 0,
      positionY: 0
    }));
  }

  // 缩小图片
  zoomOut(e?: React.MouseEvent) {
    e?.stopPropagation();
    this.setState(prevState => ({
      scale: Math.max(prevState.scale - 0.2, 0.5),
      // 重置位置为中心
      positionX: 0,
      positionY: 0
    }));
  }

  // 重置图片变换
  resetTransform(e?: React.MouseEvent) {
    e?.stopPropagation();
    this.setState({
      scale: 1,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      positionX: 0,
      positionY: 0,
      isDragging: false
    });
  }

  // 旋转图片
  rotateImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    this.setState(prevState => ({
      rotation: (prevState.rotation + 90) % 360
    }));
  }

  // 水平翻转图片
  flipImageHorizontal(e?: React.MouseEvent) {
    e?.stopPropagation();
    this.setState(prevState => ({
      flipHorizontal: !prevState.flipHorizontal
    }));
  }

  // 垂直翻转图片
  flipImageVertical(e?: React.MouseEvent) {
    e?.stopPropagation();
    this.setState(prevState => ({
      flipVertical: !prevState.flipVertical
    }));
  }

  // 处理缩略图点击
  handleThumbnailClick(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    const { allImages } = this.state;
    this.setState({
      currentImageIndex: index,
      fullscreenImage: allImages[index],
      // 重置变换状态
      scale: 1,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      positionX: 0,
      positionY: 0,
      isDragging: false
    });
  }

  // 处理键盘事件
  handleKeyDown(e: KeyboardEvent) {
    const { fullscreenImage } = this.state;
    if (fullscreenImage) {
      if (e.key === 'ArrowRight') {
        this.nextImage();
      } else if (e.key === 'ArrowLeft') {
        this.prevImage();
      } else if (e.key === 'Escape') {
        this.closeFullscreenImage();
      } else if (e.key === '+') {
        this.zoomIn();
      } else if (e.key === '-') {
        this.zoomOut();
      } else if (e.key === 'r' || e.key === 'R') {
        this.rotateImage();
      } else if (e.key === 'h' || e.key === 'H') {
        this.flipImageHorizontal();
      } else if (e.key === 'v' || e.key === 'V') {
        this.flipImageVertical();
      } else if (e.key === '0') {
        this.resetTransform();
      }
    }
  }

  // 关闭全屏图片
  closeFullscreenImage() {
    this.setState({
      fullscreenImage: null,
      // 重置变换状态
      scale: 1,
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      positionX: 0,
      positionY: 0,
      isDragging: false
    });
    document.body.style.overflow = 'auto'; // 恢复滚动
  }

  // 复制代码到剪贴板
  copyToClipboard(code: string, button: HTMLButtonElement) {
    navigator.clipboard.writeText(code).then(() => {
      const originalText = button.textContent;
      button.textContent = '已复制！';
      button.classList.add('copied');

      // 2秒后恢复按钮状态
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('复制失败:', err);
      button.textContent = '复制失败';
      setTimeout(() => {
        button.textContent = '复制';
      }, 2000);
    });
  }

  // 为文章内容中的代码块添加复制按钮和图片添加点击事件
  componentDidMount() {
    // 初始处理文章内容
    this.processContent();
    
    // 标记初始化完成
    setTimeout(() => {
      this.isInitialized = true;
      
      // 初始化完成后创建观察器
      if (this.contentRef.current && !this.mutationObserver) {
        this.mutationObserver = new MutationObserver(() => this.debouncedProcessContent());
        
        this.mutationObserver.observe(this.contentRef.current, {
          childList: true,
          subtree: false // 只观察直接子节点，不观察子树
        });
      }
      
      // 如果有搜索关键字，滚动到第一个匹配项
      if (this.props.searchKeyword) {
        this.scrollToFirstKeyword(this.props.searchKeyword);
      }
    }, 300);
    
    // 设置键盘事件监听
    window.addEventListener('keydown', this.handleKeyDown);
    
    // 设置滚动事件监听
    window.addEventListener('scroll', this.handleScroll);
    
    // 初始执行一次滚动处理
    this.handleScroll();
  }
  
  componentDidUpdate(prevProps: June_ArticleDetail.ComponentProps) {
    const { article, searchKeyword } = this.props;
    
    // 当文章内容或特色图片变化时，重新处理内容
    if (prevProps.article.content !== article.content || 
        prevProps.article.imageUrl !== article.imageUrl) {
      // 延迟处理，等待DOM更新
      setTimeout(() => {
        this.processContent();
        
        // 如果有搜索关键字并且内容已更新，滚动到第一个关键字
        if (searchKeyword) {
          this.scrollToFirstKeyword(searchKeyword);
        }
      }, 100);
    }
    
    // 如果搜索关键字发生变化，滚动到第一个匹配项
    if (prevProps.searchKeyword !== searchKeyword && searchKeyword) {
      // 延迟执行，确保DOM已经更新
      setTimeout(() => {
        this.scrollToFirstKeyword(searchKeyword);
      }, 100);
    }
  }
  
  componentWillUnmount() {
    // 清理观察器和定时器
    if (this.mutationObserver) {
      (this.mutationObserver as MutationObserver).disconnect();
      this.mutationObserver = null;
    }
    
    if (this.debounceTimerId) {
      clearTimeout(this.debounceTimerId);
      this.debounceTimerId = null;
    }
    
    // 清理滚动定时器
    if (this.scrollTimeoutRef.current) {
      clearTimeout(this.scrollTimeoutRef.current);
    }
    
    // 清理键盘事件监听
    window.removeEventListener('keydown', this.handleKeyDown);
    
    // 清理滚动事件监听
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  // 为类添加必要的属性
  isProcessing = false;
  isInitialized = false;
  mutationObserver = null;
  processContentQueued = false;
  
  // 获取图片URL的函数（不修改DOM）
  collectImageUrls() {
    const imageUrls: string[] = [];
    if (!this.contentRef.current) return imageUrls;
    
    const contentImages = this.contentRef.current.querySelectorAll('img');
    contentImages.forEach(img => {
      imageUrls.push(img.src);
    });
    
    // 如果有特色图片，添加到开头
    if (this.props.article.imageUrl) {
      imageUrls.unshift(this.props.article.imageUrl);
    }
    
    return imageUrls;
  }
  
  // 处理图片点击事件（不修改DOM）
  setupImageClickEvents() {
    if (!this.contentRef.current) return;
    
    const contentImages = this.contentRef.current.querySelectorAll('img');
    contentImages.forEach((img, index) => {
      // 使用闭包保存正确的索引值
      img.onclick = () => {
        const adjustedIndex = this.props.article.imageUrl ? index + 1 : index;
        this.handleImageClick(img.src, adjustedIndex);
      };
    });
  }
  
  // 处理代码块（修改DOM但不触发状态更新）
  processCodeBlocks() {
    if (!this.contentRef.current) return false;
    
    const codeBlocks = this.contentRef.current.querySelectorAll('pre code');
    let anyModified = false;
    
    // 先断开观察器，防止DOM修改触发新的观察
    if (this.mutationObserver) {
      (this.mutationObserver as MutationObserver).disconnect();
    }
    
    try {
      codeBlocks.forEach(codeBlock => {
        // 确保代码块有父容器且没有被包装过
        if (codeBlock.parentElement && !codeBlock.parentElement.parentElement?.classList.contains('code-block-wrapper')) {
          // 包装代码块和复制按钮
          const wrapper = document.createElement('div');
          wrapper.className = 'code-block-wrapper';

          // 将代码块移动到包装器中
          codeBlock.parentElement.parentNode?.insertBefore(wrapper, codeBlock.parentElement);
          wrapper.appendChild(codeBlock.parentElement);

          // 创建复制按钮
          const copyButton = document.createElement('button');
          copyButton.className = 'copy-button';
          copyButton.textContent = '复制';
          copyButton.onclick = () => this.copyToClipboard(codeBlock.textContent || '', copyButton);

          // 将按钮添加到包装器
          wrapper.appendChild(copyButton);
          
          anyModified = true;
        }
      });
    } finally {
      // 处理完代码块后，可以重新连接观察器
      // 但只在初始化完成后才重新连接
      if (this.isInitialized && this.mutationObserver && this.contentRef.current) {
        (this.mutationObserver as MutationObserver).observe(this.contentRef.current, {
          childList: true,
          subtree: false // 只观察直接子节点，不观察子树
        });
      }
    }
    
    return anyModified;
  }
  
  // 主要处理函数，将DOM操作和状态更新分离
  processContent() {
    console.log('processContent called, isProcessing:', this.isProcessing, 'queued:', this.processContentQueued);
    // 防止重复处理
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // 1. 处理代码块（DOM操作）
      const codeBlocksModified = this.processCodeBlocks();
      
      // 2. 设置图片点击事件（事件绑定，不修改DOM结构）
      this.setupImageClickEvents();
      
      // 3. 收集图片URL并更新状态（仅当需要时）
      const newImageUrls = this.collectImageUrls();
      
      // 只有当图片数组内容真正发生变化时才更新状态
      const imagesChanged = JSON.stringify(newImageUrls) !== JSON.stringify(this.state.allImages);
      if (imagesChanged) {
        this.setState({ allImages: newImageUrls });
      }
      
      // 如果代码块被修改，延迟一段时间后重新处理（处理可能由代码块修改引起的新DOM变化）
      // 但最多只递归一次，避免无限循环
      if (codeBlocksModified && !this.isInitialized) {
        // 使用一个单独的标志来防止重复的延迟处理
        if (!this.processContentQueued) {
          this.processContentQueued = true;
          setTimeout(() => {
            this.processContentQueued = false;
            this.processContent();
          }, 100);
        }
      }
    } finally {
      // 确保处理完成后重置标志
      setTimeout(() => {
        this.isProcessing = false;
      }, 100);
    }
  }
  
  // 防抖处理函数
  debouncedProcessContent() {
    if (this.debounceTimerId) {
      clearTimeout(this.debounceTimerId);
    }
    
    this.debounceTimerId = window.setTimeout(() => {
      if (!this.isProcessing) {
        this.processContent();
      }
    }, 200);
  }



  // 计算图片样式
  getImageStyle() {
    const { scale, rotation, positionX, positionY, flipHorizontal, flipVertical, isDragging } = this.state;
    return {
      transform: `translate(${positionX}px, ${positionY}px) scale(${scale}) rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
      transition: isDragging ? 'none' : 'transform 0.3s ease'
    };
  }

  // 处理鼠标按下事件，开始拖动
  handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // 只有在图片被放大后才能拖动
    if (this.state.scale > 1) {
      this.setState({
        isDragging: true,
        startX: e.clientX - this.state.positionX,
        startY: e.clientY - this.state.positionY
      });

      // 更改鼠标样式
      document.body.style.cursor = 'grabbing';
    }
  }

  // 处理鼠标移动事件，拖动图片
  handleMouseMove(e: React.MouseEvent) {
    if (!this.state.isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();

    // 计算新的位置
    let newPositionX = e.clientX - this.state.startX;
    let newPositionY = e.clientY - this.state.startY;

    // 获取视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let imageWidth = viewportWidth;
    let imageHeight = viewportHeight; // 估计高度

    try {
      // 获取当前图片的URL
      const { allImages, currentImageIndex } = this.state;
      const currentImageUrl = allImages[currentImageIndex];
      if (currentImageUrl) {
        // 尝试通过DOM获取图片元素来获取实际尺寸
        const imageElement = document.querySelector('.fullscreen-image-container img');
        if (imageElement && imageElement instanceof HTMLImageElement) {
          // 使用自然尺寸
          if (imageElement.naturalWidth && imageElement.naturalHeight) {
            imageWidth = imageElement.naturalWidth;
            imageHeight = imageElement.naturalHeight;
          } else {
            // 如果自然尺寸不可用，使用元素当前尺寸
            imageWidth = imageElement.width;
            imageHeight = imageElement.height;
          }
        }
      }
      // 严格按照要求设置范围：
      // 水平方向不能超过放大图片宽度-屏幕宽度
      const maxHorizontalRange = (imageWidth * this.state.scale - viewportWidth);
      // 垂直方向不能超过放大图片高度-屏幕高度
      const maxVerticalRange = (imageHeight * this.state.scale - viewportHeight);
      // 限制拖动范围，确保图片不会完全拖出屏幕
      newPositionX = Math.max(-maxHorizontalRange / 2, Math.min(maxHorizontalRange / 2, newPositionX));
      newPositionY = Math.max(-maxVerticalRange / 2, Math.min(maxVerticalRange / 2, newPositionY));

      // 只有当范围有效时才更新位置
      const updates = {};
      if (maxHorizontalRange > 0) updates['positionX'] = newPositionX;
      if (maxVerticalRange > 0) updates['positionY'] = newPositionY;
      
      if (Object.keys(updates).length > 0) {
        this.setState(updates);
      }
    } catch {
      // 如果获取失败，使用默认值
      console.warn('Failed to get actual image dimensions, using defaults');
    }
  }

  // 处理鼠标释放事件，结束拖动
  handleMouseUp() {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
      document.body.style.cursor = 'grab';
    }
  }

  // 生成目录并为标题添加ID
  generateTocAndAddIds(htmlContent: string): { content: string; toc: June_Index.TocItem[] } {
    const toc: June_Index.TocItem[] = [];
    let counter = 0;

    // 处理标题标签，添加ID并生成目录
    const processedContent = htmlContent.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (match, level, title) => {
      counter++;
      const cleanTitle = title.replace(/<[^>]*>/g, ''); // 移除标题中的HTML标签
      const id = `heading-${counter}`;

      toc.push({
        id,
        title: cleanTitle,
        level: parseInt(level)
      });

      return `<h${level} id="${id}">${title}</h${level}>`;
    });
    return { content: processedContent, toc };
  }

  // 处理滚动，更新当前阅读章节
  handleScroll = () => {
    // 防抖：避免滚动时频繁触发更新
    if (this.scrollTimeoutRef.current) {
      clearTimeout(this.scrollTimeoutRef.current);
    }
    
    this.scrollTimeoutRef.current = window.setTimeout(() => {
      // 获取所有标题元素并转换为数组，但只在文章内容区域内查找
      const headings = this.contentRef.current ? Array.from(this.contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')) : [];
      let currentSectionId = '';

      // 获取当前滚动位置（考虑页面顶部的偏移）
      const scrollPosition = window.scrollY + 100;
      
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        const headingTop = window.scrollY + rect.top;
        // 计算当前标题的内容结束位置
        let contentEnd = Number.MAX_SAFE_INTEGER;

        // 查找下一个同级或更高级的标题，确定当前标题的内容范围
        for (let j = i + 1; j < headings.length; j++) {
          const nextHeading = headings[j];
          const nextHeadingLevel = parseInt(nextHeading.tagName.substring(1));
          const currentHeadingLevel = parseInt(heading.tagName.substring(1));

          // 如果找到同级或更高级的标题，那么当前标题的内容结束位置就是该标题的顶部
          if (nextHeadingLevel <= currentHeadingLevel) {
            const nextRect = nextHeading.getBoundingClientRect();
            contentEnd = window.scrollY + nextRect.top;
            break;
          }
        }

        // 检查滚动位置是否在当前标题的内容范围内
        if (scrollPosition >= headingTop && scrollPosition < contentEnd) {
          currentSectionId = heading.id;
          break;
        }
      }
      
      if (!currentSectionId && headings.length > 0) {
        currentSectionId = headings[0].id;
      }
      
      // this.props.onParentIdsUpdate?.([currentSectionId]);
    }, 100); // 100ms的防抖延迟
  };

  // 处理标签点击
  handleTagClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const tag = e.currentTarget.textContent?.trim();
    if (tag) {
      this.props.onTagSelect(tag);
    }
  };

  // 处理鼠标滚轮事件
  handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      // 向上滚动，放大图片
      this.zoomIn(e);
    } else {
      // 向下滚动，缩小图片
      this.zoomOut(e);
    }
  };

  // 渲染函数
  render() {
    const { article, searchKeyword, onCategorySelect, onTocUpdate } = this.props;
    const { fullscreenImage, allImages, currentImageIndex, scale } = this.state;
    
    // 添加代码块到文章内容中（如果没有的话）
    const baseContent = article.content.includes('<pre><code>')
      ? article.content
      : article.content + `
      <h3>示例代码</h3>
      <pre><code>const exampleFunction = () => {
  console.log('这是一个示例代码块');
  
  // 模拟数据处理
  const data = [1, 2, 3, 4, 5];
  const result = data.map(item => item * 2);
  
  return result;
};

// 调用示例函数
console.log(exampleFunction());</code></pre>
    `;

    // 生成目录并为标题添加ID
    const { content: contentWithIds, toc } = this.generateTocAndAddIds(baseContent);
    
    // 更新目录到父组件（在componentDidMount中处理，这里只生成数据）
    if (onTocUpdate && !this.tocUpdated) {
      onTocUpdate(toc);
      this.tocUpdated = true;
    }
    
    // 如果有搜索关键字，对内容进行高亮处理
    let enhancedContent = contentWithIds;
    if (searchKeyword) {
      // 需要避免高亮代码块内的内容
      const codeBlocks: string[] = [];
      let tempContent = contentWithIds;

      // 先保存代码块内容
      const codeBlockRegex = /<pre><code>[\s\S]*?<\/code><\/pre>/g;
      tempContent = tempContent.replace(codeBlockRegex, (match) => {
        codeBlocks.push(match);
        return `CODE_BLOCK_PLACEHOLDER_${codeBlocks.length - 1}`;
      });

      // 对非代码块内容进行高亮
      tempContent = this.highlightKeyword(tempContent, searchKeyword);

      // 恢复代码块内容
      codeBlocks.forEach((codeBlock, index) => {
        tempContent = tempContent.replace(`CODE_BLOCK_PLACEHOLDER_${index}`, codeBlock);
      });

      enhancedContent = tempContent;
    }

    return (
      <div className="article-detail">
        <div className="article-header">
          <h1 className="article-title">
            {searchKeyword ? (
              <span dangerouslySetInnerHTML={{ __html: this.highlightKeyword(article.title, searchKeyword) }} />
            ) : (
              article.title
            )}
          </h1>
          <div className="article-meta">
            <span className="article-date">
              <svg className="icon" viewBox="0 0 16 16" width="14" height="14">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
              </svg>
              {article.date}
            </span>
            <span className="article-category">
              <a href="#" className="category-link" onClick={(e) => {
                e.preventDefault();
                onCategorySelect(article.category);
              }}>{article.category}</a>
            </span>
          </div>
        </div>

        {article.imageUrl && (
          <div className="article-featured-image">
            <img
              src={article.imageUrl}
              alt={article.title}
              style={{ cursor: 'pointer' }}
              onClick={() => this.handleImageClick(article.imageUrl!, 0)}
            />
          </div>
        )}

        <div
          ref={this.contentRef}
          className="article-content"
          dangerouslySetInnerHTML={{ __html: enhancedContent }}
        />

        <div className="article-tags">
          {article.tags.map((tag: string, index: number) => (
            <a key={index} href="#" className="tag" onClick={this.handleTagClick}>{tag}</a>
          ))}
        </div>

        {/* 全屏图片覆盖层 */}
        {fullscreenImage && (
          <div className="fullscreen-image-overlay">
            {/* 图片计数器 */}
            {allImages.length > 1 && (
              <div className="image-counter">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
            {/* 图片操作工具栏 */}
            <div className="image-toolbar">
              <button className="toolbar-button" onClick={this.zoomOut} title="缩小 (-)">
                <span>−</span>
              </button>
              <button className="toolbar-button" onClick={this.resetTransform} title="重置 (0)">
                <span>⟲</span>
              </button>
              <button className="toolbar-button" onClick={this.zoomIn} title="放大 (+)">
                <span>+</span>
              </button>
              <button className="toolbar-button" onClick={this.rotateImage} title="旋转 (R)">
                <span>↻</span>
              </button>
              <button className="toolbar-button" onClick={this.flipImageHorizontal} title="水平翻转 (H)">
                <span>⇄</span>
              </button>
              <button className="toolbar-button" onClick={this.flipImageVertical} title="垂直翻转 (V)">
                <span>⇅</span>
              </button>
            </div>

            <div className="fullscreen-image-container">
              {/* 左箭头按钮 */}
              {allImages.length > 1 && (
                <button className="arrow-button left-arrow" onClick={this.prevImage}>
                  ‹
                </button>
              )}

              {/* 图片显示区域 */}
              <div
                className={`image-display-area ${scale > 1 ? 'can-drag' : ''}`}
                onWheel={this.handleWheel}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
              >
                <img
                  src={fullscreenImage}
                  alt="全屏图片"
                  className="fullscreen-image"
                  style={this.getImageStyle()}
                />
              </div>

              {/* 右箭头按钮 */}
              {allImages.length > 1 && (
                <button className="arrow-button right-arrow" onClick={this.nextImage}>
                  ›
                </button>
              )}

              {/* 关闭按钮 - 只能通过此按钮关闭全屏模式 */}
              <button className="close-fullscreen-button" onClick={this.closeFullscreenImage}>
                ×
              </button>
            </div>

            {/* 底部缩略图列表 */}
            {allImages.length > 0 && (
              <div className="thumbnail-container">
                <div className="thumbnail-scroll">
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => this.handleThumbnailClick(index, e)}
                    >
                      <img
                        src={image}
                        alt={`缩略图 ${index + 1}`}
                        className="thumbnail-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}



export default ArticleDetail;