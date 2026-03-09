import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryView from './pages/CategoryView'
import DetailView from './pages/DetailView'
import mealsData from './data/meals.json'
import HeaderGrid from './components/HeaderGrid'

export default function App() {
  const [meals, setMeals] = useState([])

  useEffect(() => {
    setMeals(mealsData.meals || mealsData)
  }, [])

  useEffect(() => {
    const foodEmojis = ['🍱', '🍜', '🍲', '🥘', '🍛', '🍝', '🍕', '🍔', '🌮', '🥗', '🍙', '🥟', '🍚', '🫕', '🥠']
    let mouseIdleTimer = null
    let lastX = 0, lastY = 0

    // 1. 创建 🍢 鼠标随动器
    const tracker = document.createElement('div');
    tracker.innerHTML = '🍢';
    tracker.style.cssText = `
      position: fixed;
      font-size: 32px;
      pointer-events: none;
      z-index: 9999;
      display: none;
      user-select: none;
      transform: translate(-50%, -50%);
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
    `;
    document.body.appendChild(tracker);

    // 2. 注入全局样式 (包含悬停阴影和巨大化动画)
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: none !important; }
      
      /* 全局按钮/链接悬停阴影 */
      button:hover, a:hover, .clickable:hover, .wheel-item:hover {
        box-shadow: 0 10px 25px rgba(231, 140, 29, 0.4) !important;
        filter: brightness(1.1);
        transition: all 0.2s ease !important;
      }

      /* 静止时生成的巨型美食 (3倍大) */
      .massive-food {
        position: fixed;
        font-size: 30px; 
        z-index: 9998;
        pointer-events: none;
        user-select: none;
        transform: translate(-50%, -50%);
        animation: expandAndPulse 5s ease-out forwards;
      }

      @keyframes expandAndPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        5% { transform: translate(-50%, -50%) scale(3); opacity: 1; } 
        10% { transform: translate(-50%, -50%) scale(2.8); }
        15% { transform: translate(-50%, -50%) scale(3); }
        90% { transform: translate(-50%, -50%) scale(3); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (tracker.style.display === 'none') tracker.style.display = 'block';
      tracker.style.opacity = '1';
      tracker.style.left = `${e.clientX}px`;
      tracker.style.top = `${e.clientY}px`;

      // 仅在 Header 区域触发 1.5 倍放大
      const isInHeader = e.target.closest('header, .header-grid');
      tracker.style.transform = isInHeader 
        ? 'translate(-50%, -50%) scale(1.5)' 
        : 'translate(-50%, -50%) scale(1)';

      // 3秒静止判定
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer);
      mouseIdleTimer = setTimeout(() => {
        tracker.style.opacity = '0';
        const giant = document.createElement('div');
        giant.className = 'massive-food';
        giant.textContent = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        giant.style.left = `${lastX}px`;
        giant.style.top = `${lastY}px`;
        document.body.appendChild(giant);
        setTimeout(() => giant.remove(), 20500);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      tracker.remove();
      style.remove();
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer);
    };
  }, []);

  return (
    <Router basename="/ace-r-kitchen-">
      <header className="header-grid" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <HeaderGrid />
      </header>
      <div className="relative z-10 min-h-screen bg-transparent">
        <Routes>
          <Route path="/" element={<Home meals={meals} />} />
          <Route path="/category/:categoryName" element={<CategoryView meals={meals} />} />
          <Route path="/meal/:mealId" element={<DetailView meals={meals} />} />
          <Route path="*" element={<Home meals={meals} />} />
        </Routes>
      </div>
    </Router>
  )
}