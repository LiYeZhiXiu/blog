import  { Component } from 'react';
import '../css/MouseTrail.less';

/**
 * 鼠标跟随效果组件
 * 当鼠标移动时，生成随机颜色的小点点
 */
class MouseTrail extends Component {
  /**
   * 处理鼠标点击事件 - 实现爆炸效果
   */
  handleClick = (e: MouseEvent) => {
    // 创建爆炸效果的粒子数量
    const particleCount = 30;
    
    // 遍历创建多个粒子
    for (let i = 0; i < particleCount; i++) {
      // 创建粒子元素
      const particle = document.createElement('div');
      particle.classList.add('mouse-trail-dot');
      
      // 设置随机颜色，更亮一些以突出爆炸效果
      const colorArr=['#ff0000ff','#fafa93ff','#66f566ff','#8579f1ff']
      const randomColor = colorArr[Math.floor(Math.random() * colorArr.length)];
      particle.style.backgroundColor = randomColor;
      
      // 设置位置在点击处
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      
      // 设置随机大小（比普通粒子大一些）
      const size = Math.floor(Math.random() * 4) + 50;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // 添加到body
      document.body.appendChild(particle);
      
      // 设置动画持续时间（爆炸动画稍短一些）
      const duration = Math.random() * 500 + 500;
      particle.style.transition = `all ${duration}ms ease-out`;
      
      // 计算随机角度（0-360度）
      const angle = Math.random() * Math.PI * 2;
      // 计算随机距离（爆炸的扩散范围）
      const distance = Math.floor(Math.random() * 60) + 100;
      // 计算X和Y方向的位移
      const translateX = Math.cos(angle) * distance;
      const translateY = Math.sin(angle) * distance;
      
      // 触发爆炸动画
      setTimeout(() => {
        particle.style.transform = `translate(${translateX}px, ${translateY}px) scale(0)`;
        // 添加旋转效果增加动感
        const rotate = Math.random() * 360 - 180; // -180到180度随机旋转
        particle.style.transform += ` rotate(${rotate}deg)`;
      }, 0);
      
      // 动画结束后移除元素
      setTimeout(() => {
        if (particle.parentNode) {
          document.body.removeChild(particle);
        }
      }, duration);
    }
  };

  /**
   * 处理鼠标移动事件
   */
  handleMouseMove = (e: MouseEvent) => {
    // 创建小点点元素
    const dot = document.createElement('div');
    dot.classList.add('mouse-trail-dot');
    // 设置星星字符
    dot.textContent = '✦';
    // 设置随机颜色
    const randomColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    dot.style.color = randomColor;
    
    // 设置位置 - 稍微偏移鼠标位置以避免遮挡
    dot.style.left = `${e.clientX - 10}px`;
    dot.style.top = `${e.clientY - 10}px`;
    
    // 设置随机大小（2-4像素）
    const size = Math.floor(Math.random() * 3) + 5;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    
    // 添加到body
    document.body.appendChild(dot);
    
    // 设置动画持续时间（2-3秒）
    const duration = Math.random() * 1000 + 500;
    dot.style.transition = `all ${duration}ms ease-out`;
    
    // 触发下落动画，随机向左下或右下移动
    setTimeout(() => {
      dot.style.opacity = '0';
      // 随机决定方向（true为向右，false为向左）
      const direction = Math.random() > 0.5;
      // 随机生成左右位移量（15-35像素）
      const horizontalDistance = Math.floor(Math.random() * 20) + 15;
      // 根据方向计算水平位移值（正值向右，负值向左）
      const translateX = direction ? horizontalDistance : -horizontalDistance;
      // 组合水平和垂直位移，实现随机方向的下落效果
      dot.style.transform = `translate(${translateX}px, 60px) scale(0.5)`;
    }, 10);
    
    // 动画结束后移除元素
    setTimeout(() => {
      document.body.removeChild(dot);
    }, duration);
  };

  /**
   * 组件挂载时添加事件监听
   */
  componentDidMount() {
    // 添加鼠标移动事件监听
    document.addEventListener('mousemove', this.handleMouseMove);
    // 添加鼠标点击事件监听
    document.addEventListener('click', this.handleClick);
  }

  /**
   * 组件卸载时移除事件监听
   */
  componentWillUnmount() {
    // 移除鼠标移动事件监听
    document.removeEventListener('mousemove', this.handleMouseMove);
    // 移除鼠标点击事件监听
    document.removeEventListener('click', this.handleClick);
  }

  /**
   * 渲染组件（不渲染任何内容，只是添加事件监听）
   */
  render() {
    return null;
  }
}

export default MouseTrail;