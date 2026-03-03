import { useState, useEffect } from 'react'
import RadialMenu from '../components/RadialMenu'
import MealCard from '../components/MealCard'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/config'

export default function Home({ meals }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [footerOffset, setFooterOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    const duration = Math.max(1000, Math.min(2000, distance / 0.3)) // 距离越远动画越久，最少1s，最多2s

    const startTime = Date.now()

    const animateScroll = () => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // 缓动函数（ease-out）
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

  // 获取选中分类的所有菜品
  const displayMeals = selectedCategory
    ? meals.filter((meal) => meal.category === selectedCategory)
    : meals

  // 按日期排序（最新在前）
  const sortedMeals = [...displayMeals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  // 只显示前10个(5x2)
  const displayedMeals = sortedMeals.slice(0, 10)

  // 获取分类颜色
  const getCategoryColor = (categoryName) => {
    return CATEGORIES[categoryName]?.color || '#E8934A'
  }

  return (
    <div className="min-h-screen bg-cream relative">
      {/* 转盘菜单区 */}
      <RadialMenu
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 菜品展示区 */}
      {selectedCategory && (
        <section id={`section-${selectedCategory}`} className="py-12 md:py-16 px-4 bg-cream">
          <div className="max-w-7xl mx-auto">
            {/* 分类标题 */}
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-2">
                {CATEGORIES[selectedCategory].icon} {selectedCategory}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                {sortedMeals.length} 条记录
              </p>
            </div>

            {/* 菜品网格 - 5x2 */}
            {displayedMeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
                {displayedMeals.map((meal, index) => (
                  <div key={meal.id} className="animate-fade-in" style={{ 
                    animationDelay: `${index * 0.1}s` 
                  }}>
                    <MealCard
                      meal={meal}
                      categoryColor={getCategoryColor(meal.category)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  该分类暂无记录，敬请期待 ✨
                </p>
              </div>
            )}

            {/* 更多按钮 */}
            {sortedMeals.length > 10 && (
              <div className="text-center">
                <button
                  onClick={() => window.location.href = `/category/${selectedCategory}`}
                  className="px-8 py-3 bg-orange text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  查看全部 ({sortedMeals.length - 10} 更多)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 所有菜品展示区（未选中分类时）*/}
      {!selectedCategory && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
              {sortedMeals.slice(0, 10).map((meal, index) => (
                <div key={meal.id} className="animate-fade-in" style={{ 
                  animationDelay: `${index * 0.1}s` 
                }}>
                  <MealCard
                    meal={meal}
                    categoryColor={getCategoryColor(meal.category)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 页脚 */}
      <Footer />

      {/* 悬浮返回顶部按钮 - 米饭火箭 */}
      {showScrollTop && (
        <div
          className="fixed w-14 h-14 rounded-full bg-orange text-white shadow-medium hover:bg-opacity-90 transition-all z-50 flex items-center justify-center text-4xl cursor-pointer group"
          onClick={scrollToTop}
          title="返回顶部"
          style={{
            bottom: footerOffset > 0 ? `max(2rem, ${window.innerHeight - (footerOffset - window.scrollY) + 1.5 * 16}px)` : '2rem',
            right: '2rem',
          }}
        >
          {/* 米饭图标 */}
          <span className="group-hover:animate-bounce">🍚</span>

          {/* 火箭动画容器 */}
          {isAnimating && (
            <>
              {/* 主火焰 */}
              <div
                className="absolute -bottom-8"
                style={{
                  animation: `rocketFire 0.8s ease-out infinite`,
                }}
              >
                🔥
              </div>
              {/* 副火焰1 */}
              <div
                className="absolute -bottom-8 -left-4"
                style={{
                  animation: `rocketFire 0.7s ease-out infinite 0.1s`,
                  opacity: 0.7,
                }}
              >
                🔥
              </div>
              {/* 副火焰2 */}
              <div
                className="absolute -bottom-8 -right-4"
                style={{
                  animation: `rocketFire 0.75s ease-out infinite 0.15s`,
                  opacity: 0.7,
                }}
              >
                🔥
              </div>
            </>
          )}
        </div>
      )}

      {/* 火焰动画样式 */}
      <style>{`
        @keyframes rocketFire {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(12px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}