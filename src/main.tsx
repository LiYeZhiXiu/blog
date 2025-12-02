// 确保在客户端环境中运行
if (typeof window !== 'undefined') {
  // 等待DOM完全加载
  window.addEventListener('DOMContentLoaded', () => {
    // 直接导入所需模块，避免嵌套Promise
    import('react-dom/client').then(({ createRoot }) => {
      import('react-router-dom').then(({ BrowserRouter }) => {
        import('./App.tsx').then(({ default: App }) => {
          // 确保在所有导入完成后再渲染
          setTimeout(() => {
            // 再次检查根元素是否存在
            const rootElement = document.getElementById('root');
            console.log('Root element:', rootElement);
            
            if (rootElement) {
              // 创建根并渲染应用
              const root = createRoot(rootElement);
              root.render(
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              );
            } else {
              console.error('Root element not found');
            }
          }, 0); // 下一事件循环执行，确保DOM完全准备好
        });
      });
    });
  });
  
  // 立即导入样式，确保样式加载不延迟
  import('./styles/global.less');
  import('./styles/responsive.less');
}
