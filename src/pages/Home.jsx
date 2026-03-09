import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RadialMenu from '../components/RadialMenu'
import MealCard from '../components/MealCard'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/config'

export default function Home({ meals }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [footerOffset, setFooterOffset] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const updateFooterOffset = () => {
      const footer = document.querySelector('footer')
      if (footer) {
        const rect = footer.getBoundingClientRect()
        const footerTop = window.scrollY + rect.top
        setFooterOffset(footerTop)
      }
    }
    updateFooterOffset()
    window.addEventListener('resize', updateFooterOffset)
    window.addEventListener('scroll', updateFooterOffset)
    return () => {
      window.removeEventListener('resize', updateFooterOffset)
      window.removeEventListener('scroll', updateFooterOffset)
    }
  }, [])

  // 核心修改：缩短滚动时间，保留原位喷火设计
  const scrollToTop = () => {
    if (isAnimating) return

    setIsAnimating(true)
    const startPosition = window.scrollY
    const distance = startPosition
    
    // --- 优化：将时间大幅缩短，实现“瞬移”火箭效果 ---
    // 原来是 1000-2000ms，现在改为 300-600ms
    const duration = Math.max(300, Math.min(600, distance / 2))

    const startTime = Date.now()

    const animateScroll = () => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // 使用 EaseOutExpo 让起步极快，结尾平滑
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const newPosition = startPosition * (1 - easeProgress)

      window.scrollTo(0, newPosition)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        setIsAnimating(false)
      }
    }
    requestAnimationFrame(animateScroll)
  }

  const categories = Object.entries(CATEGORIES).sort((a, b) => a[1].order - b[1].order)
  const sortedMeals = [...meals].sort((a, b) => new Date(b.date) - new Date(a.date))

  const renderMealGrid = (categoryName, limit = 10) => {
    const categoryMeals = categoryName 
      ? sortedMeals.filter((meal) => meal.category === categoryName).slice(0, limit)
      : sortedMeals.slice(0, limit)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
        {categoryMeals.map((meal, index) => (
          <div key={meal.id} className="animate-fade-in clickable" style={{ animationDelay: `${index * 0.1}s` }}>
            <MealCard
              meal={meal}
              categoryColor={CATEGORIES[meal.category]?.color || '#E8934A'}
              hideRating={true}
              hideDate={true}
              hidePrice={meal.category !== '餐厅' && meal.category !== '外卖'}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream relative">
      <RadialMenu selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-2">最新推荐</h2>
            <p className="text-gray-600 text-sm md:text-base">共 {meals.length} 条美食记录</p>
          </div>
          {renderMealGrid(null, 10)}
        </div>
      </section>

      {categories.map(([categoryName, categoryConfig]) => {
        const categoryMeals = sortedMeals.filter((meal) => meal.category === categoryName)
        if (categoryMeals.length === 0) return null
        return (
          <section key={categoryName} id={`category-${categoryName}`} className="py-12 md:py-16 px-4 bg-cream">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-2">{categoryConfig.icon} {categoryName}</h2>
                </div>
                {categoryMeals.length > 10 && (
                  <button
                    onClick={() => navigate(`/category/${categoryName}`)}
                    className="px-6 py-2 bg-orange text-white rounded-lg transition-all clickable"
                  >
                    查看更多
                  </button>
                )}
              </div>
              {renderMealGrid(categoryName, 10)}
            </div>
          </section>
        )
      })}

      <Footer />

      {/* 悬浮按钮：保留原位，增加 🔥 动画 */}
      <div
        className="fixed rounded-full text-white transition-all z-50 flex items-center justify-center text-7xl cursor-pointer group clickable"
        onClick={scrollToTop}
        title="返回顶部"
        style={{
          bottom: footerOffset > 0 ? `max(2rem, ${window.innerHeight - (footerOffset - window.scrollY) + 1.5 * 16}px)` : '2rem',
          right: '2rem',
          width: '112px',
          height: '112px',
          background: 'radial-gradient(circle at 30% 30%, rgba(232, 147, 74, 0.8), rgba(232, 147, 74, 0.3))',
          boxShadow: '0 0 40px rgba(232, 147, 74, 0.4), inset -10px -10px 30px rgba(0,0,0,0.1)',
        }}
      >
        <span className="group-hover:scale-110 transition-transform select-none">🍙</span>

        {/* 原位喷火设计 */}
        {isAnimating && (
          <>
            <div className="absolute -bottom-16" style={{ animation: `rocketFire 0.8s ease-out infinite`, fontSize: '2rem' }}>🔥</div>
            <div className="absolute -bottom-16 -left-6" style={{ animation: `rocketFire 0.7s ease-out infinite 0.1s`, opacity: 0.7, fontSize: '1.5rem' }}>🔥</div>
            <div className="absolute -bottom-16 -right-6" style={{ animation: `rocketFire 0.75s ease-out infinite 0.15s`, opacity: 0.7, fontSize: '1.5rem' }}>🔥</div>
          </>
        )}
      </div>

      <style>{`
        @keyframes rocketFire {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(20px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}