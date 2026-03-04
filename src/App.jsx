import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryView from './pages/CategoryView'
import DetailView from './pages/DetailView'
import mealsData from './data/meals.json'

export default function App() {
  const [meals, setMeals] = useState([])

  useEffect(() => {
    // 简洁！只需直接设置数据
    setMeals(mealsData.meals)
  }, [])

  // 鼠标追踪和动态效果
  useEffect(() => {
    const foodEmojis = ['🍱', '🍜', '🍲', '🥘', '🍛', '🍝', '🍕', '🍔', '🌮', '🥗', '🍙', '🥟', '🍚', '🫕', '🥠']
    let mouseIdleTimer = null
    let lastMouseX = 0
    let lastMouseY = 0

    // 创建追踪光圈元素（仅用于视觉效果，不影响转盘）
    const tracker = document.createElement('div')
    tracker.id = 'mouse-tracker'
    tracker.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(232, 147, 74, 0.15) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
      display: none;
    `
    document.body.appendChild(tracker)

    const handleMouseMove = (e) => {
      lastMouseX = e.clientX
      lastMouseY = e.clientY

      // 显示追踪光圈
      tracker.style.display = 'block'
      tracker.style.opacity = '1'
      tracker.style.left = `${e.clientX - 150}px`
      tracker.style.top = `${e.clientY - 150}px`

      // 清除空闲计时器
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer)

      // 设置新的空闲计时器（5秒无鼠标移动后显示emoji）
      mouseIdleTimer = setTimeout(() => {
        const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
        const emojiEl = document.createElement('div')
        emojiEl.className = 'emoji-float'
        emojiEl.textContent = randomEmoji
        emojiEl.style.left = `${lastMouseX}px`
        emojiEl.style.top = `${lastMouseY}px`
        document.body.appendChild(emojiEl)

        // 2秒后移除
        setTimeout(() => emojiEl.remove(), 2000)
      }, 5000)
    }

    const handleMouseLeave = () => {
      tracker.style.opacity = '0'
      tracker.style.display = 'none'
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (mouseIdleTimer) clearTimeout(mouseIdleTimer)
      tracker.remove()
    }
  }, [])

  return (
    <Router basename="/ace-r-kitchen-">
      {/* 核心内容容器：z-index 设为 10，确保它在所有背景层之上 */}
      <div className="relative z-10 min-h-screen">
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