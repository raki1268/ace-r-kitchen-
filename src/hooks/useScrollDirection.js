import { useState, useEffect } from 'react';

/**
 * 自定义 Hook：监听滚动到底部
 * @param {number} offset 触发偏移量（像素）
 * @returns {boolean} 是否已经触底
 */
export function useScrollBottom(offset = 100) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 计算窗口高度 + 滚动距离
      const scrollPosition = window.innerHeight + window.scrollY;
      // 计算页面总高度
      const scrollHeight = document.documentElement.scrollHeight;
      
      // 判断是否进入底部区域
      if (scrollPosition >= scrollHeight - offset) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return isBottom;
}