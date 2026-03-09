import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/config'

export default function RadialMenu({ selectedCategory, onCategoryChange }) {
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  // confirmedCategory: 用户已"Go"确认的分类，null 表示未确认
  const [confirmedCategory, setConfirmedCategory] = useState(null)
  // pendingCategory: 轮盘当前指向的分类（Play 状态下也会更新）
  const [pendingCategory, setPendingCategory] = useState('餐厅')
  // buttonState: 'play' | 'go'
  const [buttonState, setButtonState] = useState('play')
  const [spinDuration, setSpinDuration] = useState(0.6)
  // 按钮按压动画
  const [buttonPressed, setButtonPressed] = useState(false)

  const categories = Object.entries(CATEGORIES).sort((a, b) => a[1].order - b[1].order)
  const totalSegments = categories.length
  const segmentAngle = 360 / totalSegments

  // 初始化：指针指向餐厅，C 无高亮，按钮显示 Play
  useEffect(() => {
    const index = categories.findIndex(([name]) => name === '餐厅')
    if (index !== -1) {
      const targetRotation = getSegmentRotation(index)
      setRotation(targetRotation)
      setPendingCategory('餐厅')
    }
  }, [])

  const getSegmentRotation = (index) => {
    return -(index * segmentAngle + segmentAngle / 2)
  }

  // 旋转轮盘到指定分类（不滚动，不确认）
  const rotateTo = (categoryName, callback) => {
    if (isAnimating) return
    const index = categories.findIndex(([name]) => name === categoryName)
    if (index === -1) return

    const targetRotation = getSegmentRotation(index)
    setSpinDuration(0.6)
    setRotation(targetRotation)
    setIsAnimating(true)
    setPendingCategory(categoryName)

    setTimeout(() => {
      setIsAnimating(false)
      if (callback) callback()
    }, 600)
  }

  // 滚动到对应 section
  const scrollToCategory = (categoryName) => {
    const section = document.getElementById(`category-${categoryName}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ——— A：汉堡菜单点击 ———
  // 直接导航到 section，轮盘跟随变化，按钮显示 Play（不变成 Go）
  const handleMenuItemClick = (categoryName) => {
    if (isAnimating) return
    setShowMenu(false)

    rotateTo(categoryName, () => {
      // 汉堡菜单点击后：轮盘对齐，C 高亮对应项，但按钮保持 Play
      // 然后直接滚动过去
      scrollToCategory(categoryName)
    })

    // 更新 C 的高亮，但不确认（buttonState 保持 play）
    onCategoryChange(categoryName)
    setButtonState('play')
    setConfirmedCategory(null)
  }

  // ——— B：点击轮盘扇区 ———
  // 旋转到对应位置，C 高亮对应项，按钮变成 Go（等待用户确认）
  const handleWheelClick = (index, categoryName) => {
    if (isAnimating) return

    rotateTo(categoryName)
    onCategoryChange(categoryName)
    setButtonState('go')
  }

  // ——— C：点击底部标签 ———
  // 轮盘旋转到对应位置，按钮变成 Go（等待用户确认）
  const handleTagClick = (categoryName) => {
    if (isAnimating) return

    rotateTo(categoryName)
    onCategoryChange(categoryName)
    setButtonState('go')
  }

  // ——— 中心按钮点击 ———
  const handleCenterButtonClick = () => {
    if (isAnimating) return

    // 按压动画
    setButtonPressed(true)
    setTimeout(() => setButtonPressed(false), 200)

    if (buttonState === 'play') {
      // Play 状态：随机选一个分类，转盘旋转过去，按钮变 Go
      const randomIndex = Math.floor(Math.random() * categories.length)
      const randomCategory = categories[randomIndex][0]

      // 加多圈旋转效果：先转2~4整圈再停到目标位置
      const extraSpins = (2 + Math.floor(Math.random() * 3)) * 360
      const targetRotation = getSegmentRotation(randomIndex)
      const currentNormalized = rotation % 360
      const newRotation = rotation - extraSpins + (targetRotation - currentNormalized)

      setSpinDuration(3)
      setRotation(newRotation)
      setIsAnimating(true)
      setPendingCategory(randomCategory)
      onCategoryChange(randomCategory)

      setTimeout(() => {
        setIsAnimating(false)
        setButtonState('go')
      }, 3000)
    } else {
      // Go 状态：滚动到对应 section，确认分类
      setConfirmedCategory(pendingCategory)
      scrollToCategory(pendingCategory)
    }
  }

  const getSegmentColor = (index) => {
    return categories[index][1].color
  }

  // Go 按钮颜色
  const centerButtonColor = buttonState === 'go' ? '#4CAF50' : '#FFFFFF'
  const centerButtonTextColor = buttonState === 'go' ? '#FFFFFF' : '#333333'

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
        {/* 顶部指针（在转盘外，不旋转）*/}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          {/* 顶部指针：锋利三角形 */}
          <div
            style={{
              position: 'absolute',
              top: '-1.6rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '28px solid #1a1a1a',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
            }}
          />

          {/* 旋转的扇区 SVG — pointerEvents none，点击事件在 path 上单独处理 */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
              transition: isAnimating
                ? `transform ${spinDuration}s cubic-bezier(0.2, 0.8, 0.3, 1)`
                : 'none',
              zIndex: 10,
              pointerEvents: 'none',
            }}
            viewBox="0 0 200 200"
          >
            {categories.map((_, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
              const color = getSegmentColor(index)

              const x1 = 100 + 100 * Math.cos(startAngle)
              const y1 = 100 + 100 * Math.sin(startAngle)
              const x2 = 100 + 100 * Math.cos(endAngle)
              const y2 = 100 + 100 * Math.sin(endAngle)

              const largeArc = segmentAngle > 180 ? 1 : 0
              // 内径28，中心留出空洞供按钮覆盖
              const innerR = 28
              const x1o = 100 + innerR * Math.cos(startAngle)
              const y1o = 100 + innerR * Math.sin(startAngle)
              const x2o = 100 + innerR * Math.cos(endAngle)
              const y2o = 100 + innerR * Math.sin(endAngle)
              const path = `M ${x1o} ${y1o} L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} L ${x2o} ${y2o} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1o} ${y1o} Z`

              const midAngle = (startAngle + endAngle) / 2
              const textX = 100 + 65 * Math.cos(midAngle)
              const textY = 100 + 65 * Math.sin(midAngle)
              const textRotation = (midAngle * 180 / Math.PI) + 90

              return (
                <g key={index}>
                  <path
                    d={path}
                    fill={color}
                    stroke="#1a1a1a"
                    strokeWidth="2.5"
                    style={{ pointerEvents: 'all', cursor: 'pointer' }}
                    onClick={() => handleWheelClick(index, categories[index][0])}
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation} ${textX} ${textY})`}
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fill: '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif',
                      pointerEvents: 'none',
                    }}
                  >
                    {categories[index][0]}
                  </text>
                </g>
              )
            })}
            {/* 外圈描边：机械表圈质感 */}
            <circle cx="100" cy="100" r="99" fill="none" stroke="#1a1a1a" strokeWidth="3" style={{ pointerEvents: 'none' }} />
            <circle cx="100" cy="100" r="93" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" style={{ pointerEvents: 'none' }} />
            {/* 内圈描边 */}
            <circle cx="100" cy="100" r="29" fill="none" stroke="#1a1a1a" strokeWidth="2" style={{ pointerEvents: 'none' }} />
          </svg>

          {/* 中心按钮 — 独立于SVG之外，fixed在转盘正中，不受SVG影响 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translateY(${buttonPressed ? '5px' : '0px'})`,
              zIndex: 30,
              transition: 'transform 0.1s ease',
            }}
          >
            <button
              onClick={handleCenterButtonClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'min(120px, 18vw)',
                height: 'min(120px, 18vw)',
                borderRadius: '50%',
                backgroundColor: buttonState === 'go' ? '#4CAF50' : '#2D2D2D',
                color: '#FFFFFF',
                fontSize: 'min(17px, 4vw)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '800',
                letterSpacing: '0.05em',
                boxShadow: buttonPressed
                  ? '0 1px 2px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.3)'
                  : buttonState === 'go'
                    ? '0 6px 0 #2e7d32, 0 8px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : '0 6px 0 #111111, 0 8px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                transition: 'box-shadow 0.1s ease, background-color 0.3s ease',
                border: buttonState === 'go'
                  ? '2px solid rgba(255,255,255,0.2)'
                  : '2px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                userSelect: 'none',
                outline: 'none',
              }}
            >
              {buttonState === 'play' ? 'Play' : 'Go'}
            </button>
          </div>
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
                // C 只在 buttonState==='go' 且 pendingCategory===name 时高亮
                opacity: (buttonState === 'go' && pendingCategory === name) ? 1 : 0.6,
                transform: (buttonState === 'go' && pendingCategory === name) ? 'scale(1.33)' : 'scale(1)',
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