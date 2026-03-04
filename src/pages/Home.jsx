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

  // 计算footer位置
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

  // 滚动到顶部
  const scrollToTop = () => {
    if (isAnimating) return

    setIsAnimating(true)
    const startPosition = window.scrollY
    const distance = startPosition
    const duration = Math.max(1000, Math.min(2000, distance / 0.3))

    const startTime = Date.now()

    const animateScroll = () => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      const easeProgress = 1 - Math.pow(1 - progress, 3)
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

  // 按日期排序所有菜品
  const sortedMeals = [...meals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  // 获取分类颜色和隐藏价格的逻辑
  const getCategoryColor = (categoryName) => {
    return CATEGORIES[categoryName]?.color || '#E8934A'
  }

  const shouldHidePrice = (categoryName) => {
    return categoryName !== '餐厅' && categoryName !== '外卖'
  }

  // 渲染菜品网格
  const renderMealGrid = (categoryName, limit = 10) => {
    const categoryMeals = categoryName 
      ? sortedMeals.filter((meal) => meal.category === categoryName).slice(0, limit)
      : sortedMeals.slice(0, limit)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
        {categoryMeals.map((meal, index) => (
          <div key={meal.id} className="animate-fade-in" style={{ 
            animationDelay: `${index * 0.1}s` 
          }}>
            <MealCard
              meal={meal}
              categoryColor={getCategoryColor(meal.category)}
              hideRating={true}
              hideDate={true}
              hidePrice={shouldHidePrice(meal.category)}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream relative">
      {/* 转盘菜单区 */}
      <RadialMenu
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 最新推荐区域 */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
              最新推荐
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              共 {meals.length} 条美食记录
            </p>
          </div>

          {renderMealGrid(null, 10)}
        </div>
      </section>

      {/* 各分类展示区 */}
      {categories.map(([categoryName, categoryConfig]) => {
        const categoryMeals = sortedMeals.filter((meal) => meal.category === categoryName)
        if (categoryMeals.length === 0) return null

        return (
          <section 
            key={categoryName}
            id={`category-${categoryName}`}
            className="py-12 md:py-16 px-4 bg-cream"
          >
            <div className="max-w-7xl mx-auto">
              {/* 分类标题 */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
                    {categoryConfig.icon} {categoryName}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {categoryMeals.length} 条记录
                  </p>
                </div>
                {categoryMeals.length > 10 && (
                  <button
                    onClick={() => navigate(`/category/${categoryName}`)}
                    className="px-6 py-2 bg-orange text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm md:text-base"
                  >
                    查看更多 ({categoryMeals.length - 10})
                  </button>
                )}
              </div>

              {/* 菜品网格 - 5x2 */}
              {renderMealGrid(categoryName, 10)}
            </div>
          </section>
        )
      })}

      {/* 页脚 */}
      <Footer />

      {/* 悬浮返回顶部按钮 - 米饭火箭 */}
      <div
        className="fixed rounded-full text-white shadow-medium hover:shadow-lg transition-all z-50 flex items-center justify-center text-7xl cursor-pointer group"
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
        {/* 米饭图标 */}
        <span className="group-hover:scale-110 transition-transform">🍚</span>

        {/* 火箭动画容器 */}
        {isAnimating && (
          <>
            {/* 主火焰 */}
            <div
              className="absolute -bottom-16"
              style={{
                animation: `rocketFire 0.8s ease-out infinite`,
                fontSize: '2rem',
              }}
            >
              🔥
            </div>
            {/* 副火焰1 */}
            <div
              className="absolute -bottom-16 -left-6"
              style={{
                animation: `rocketFire 0.7s ease-out infinite 0.1s`,
                opacity: 0.7,
                fontSize: '1.5rem',
              }}
            >
              🔥
            </div>
            {/* 副火焰2 */}
            <div
              className="absolute -bottom-16 -right-6"
              style={{
                animation: `rocketFire 0.75s ease-out infinite 0.15s`,
                opacity: 0.7,
                fontSize: '1.5rem',
              }}
            >
              🔥
            </div>
          </>
        )}
      </div>

      {/* 火焰动画样式 */}
      <style>{`
        @keyframes rocketFire {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(20px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}