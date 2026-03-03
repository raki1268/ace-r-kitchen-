import { useState } from 'react'
import RadialMenu from '../components/RadialMenu'
import MealCard from '../components/MealCard'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/config'

export default function Home({ meals }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  // 获取选中分类的所有菜品
  const displayMeals = selectedCategory
    ? meals.filter((meal) => meal.category === selectedCategory)
    : meals

  // 按日期排序（最新在前）
  const sortedMeals = [...displayMeals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  // 获取分类颜色
  const getCategoryColor = (categoryName) => {
    return CATEGORIES[categoryName]?.color || '#E8934A'
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* 转盘菜单区 */}
      <RadialMenu
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 菜品展示区 */}
      {selectedCategory && (
        <section className="py-12 md:py-16 px-4 bg-cream">
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

            {/* 菜品网格 */}
            {sortedMeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sortedMeals.map((meal, index) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedMeals.slice(0, 6).map((meal, index) => (
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
    </div>
  )
}