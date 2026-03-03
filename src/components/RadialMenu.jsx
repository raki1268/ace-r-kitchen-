import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/config'

export default function RadialMenu({ selectedCategory, onCategoryChange }) {
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const categories = Object.entries(CATEGORIES).sort((a, b) => a[1].order - b[1].order)
  const totalSegments = categories.length
  const segmentAngle = 360 / totalSegments

  // 计算指针指向扇形中点的角度
  const getSegmentRotation = (index) => {
    return -(index * segmentAngle + segmentAngle / 2)
  }

  // 菜单点击 - 只转动转盘，不跳转
  const handleMenuItemClick = (categoryName) => {
    if (isAnimating) return
    
    const index = categories.findIndex(([name]) => name === categoryName)
    const targetRotation = getSegmentRotation(index)
    
    setRotation(targetRotation)
    setIsAnimating(true)
    onCategoryChange(categoryName)
    setShowMenu(false)

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  // 转盘点击 - 转动 + 跳转到内容
  const handleWheelClick = (index, categoryName) => {
    if (isAnimating) return

    const targetRotation = getSegmentRotation(index)
    setRotation(targetRotation)
    setIsAnimating(true)
    onCategoryChange(categoryName)
    setShowMenu(false)

    // 跳转到下方内容区域
    setTimeout(() => {
      const section = document.getElementById(`section-${categoryName}`)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    }, 300)

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  // 标签点击 - 跳转到内容
  const handleTagClick = (categoryName) => {
    const index = categories.findIndex(([name]) => name === categoryName)
    handleWheelClick(index, categoryName)
  }

  // 计算扇区的颜色
  const getSegmentColor = (index) => {
    return categories[index][1].color
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 texture-overlay">
      {/* 汉堡菜单 - A位置 */}
      <div className="fixed top-6 left-6 z-40">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-12 h-12 flex flex-col justify-center items-center gap-1.5 bg-white rounded-lg shadow-soft hover:bg-orange hover:text-white transition-colors"
        >
          <span className="w-6 h-0.5 bg-current block"></span>
          <span className="w-6 h-0.5 bg-current block"></span>
          <span className="w-6 h-0.5 bg-current block"></span>
        </button>

        {/* 下拉菜单 */}
        {showMenu && (
          <div className="absolute top-14 left-0 bg-white rounded-lg shadow-medium p-2 w-48 animate-slide-up">
            {categories.map(([name, config]) => (
              <button
                key={name}
                onClick={() => handleMenuItemClick(name)}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <span className="text-lg">{config.icon}</span>
                <span className="font-medium text-charcoal">{name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 标题区域 */}
      <div className="text-center mb-8 md:mb-12 animate-fade-in">
        <div className="text-9xl md:text-9xl mb-4">🍚</div>
        <h1 className="font-display text-4xl md:text-6xl text-charcoal mb-2">
          Ace.R's Kitchen
        </h1>
        <p className="font-serif text-lg md:text-xl text-gray-600 italic">
          家庭三餐精选记录
        </p>
      </div>

      {/* 转盘容器 - B位置 */}
      <div className="flex justify-center items-center mb-12 md:mb-16">
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          {/* 转盘中心点指示器 */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-cream border-4 border-orange shadow-medium flex items-center justify-center">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange"></div>
            </div>
            {/* 顶部指针 */}
            <div className="absolute -top-8 md:-top-10 w-4 h-8 md:w-5 md:h-10 bg-orange rounded-b-lg"></div>
          </div>

          {/* SVG转盘 */}
          <svg
            className="w-full h-full transition-smooth"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
            viewBox="0 0 200 200"
          >
            {categories.map((_, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
              const color = getSegmentColor(index)

              // 计算路径
              const x1 = 100 + 100 * Math.cos(startAngle)
              const y1 = 100 + 100 * Math.sin(startAngle)
              const x2 = 100 + 100 * Math.cos(endAngle)
              const y2 = 100 + 100 * Math.sin(endAngle)

              const largeArc = segmentAngle > 180 ? 1 : 0
              const path = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`

              // 计算文字位置（扇形中点）
              const midAngle = (startAngle + endAngle) / 2
              const textX = 100 + 65 * Math.cos(midAngle)
              const textY = 100 + 65 * Math.sin(midAngle)
              const textRotation = (midAngle * 180 / Math.PI) + 90

              return (
                <g key={index}>
                  <path
                    d={path}
                    fill={color}
                    stroke="#F5F1ED"
                    strokeWidth="2"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => handleWheelClick(index, categories[index][0])}
                  />
                  {/* 分类文字 */}
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation} ${textX} ${textY})`}
                    className="pointer-events-none"
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fill: '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {categories[index][0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* 分类标签 - C位置 */}
      <div className="text-center mb-8 animate-slide-up">
        <p className="text-gray-500 text-sm mb-2">点击任意扇区开始探索</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(([name, config]) => (
            <button
              key={name}
              onClick={() => handleTagClick(name)}
              className="px-3 py-1 rounded-full text-xs md:text-sm font-medium cursor-pointer transition-all"
              style={{
                backgroundColor: config.color,
                color: '#FFFFFF',
                opacity: selectedCategory === name ? 1 : 0.6,
                transform: selectedCategory === name ? 'scale(1.33)' : 'scale(1)',
              }}
            >
              {config.icon} {name}
            </button>
          ))}
        </div>
      </div>

      {/* 装饰线 */}
      <div className="decorative-line"></div>

      {/* 指南文本 */}
      <div className="text-center text-gray-600 text-sm max-w-md">
        <p>
          探索不同来源的美食记录，每一顿都有故事。
          <br />
          从便当到自煮，从外卖到餐厅，这里记录的是味蕾的旅程。
        </p>
      </div>
    </div>
  )
}