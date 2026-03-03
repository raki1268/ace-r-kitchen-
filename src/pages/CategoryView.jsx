import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import MealCard from '../components/MealCard'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/config'

export default function CategoryView({ meals }) {
  const { categoryName } = useParams()
  const navigate = useNavigate()

  // 获取该分类的所有菜品
  const categoryMeals = meals.filter((meal) => meal.category === categoryName)

  // 按日期排序（最新在前）
  const sortedMeals = [...categoryMeals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const categoryConfig = CATEGORIES[categoryName]
  const categoryColor = categoryConfig?.color || '#E8934A'

  // 计算统计数据
  const avgRating =
    sortedMeals.length > 0
      ? (
          sortedMeals.reduce((sum, meal) => sum + meal.rating, 0) /
          sortedMeals.length
        ).toFixed(1)
      : 0
  const totalCost = sortedMeals.reduce((sum, meal) => sum + meal.cost, 0)
  const avgCost =
    sortedMeals.length > 0 ? (totalCost / sortedMeals.length).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-cream">
      {/* 头部 */}
      <Header
        title="Ace.R's Kitchen"
        subtitle="家庭三餐精选"
        showBack={true}
        onBack={() => navigate('/')}
      />

      {/* 分类介绍区 */}
      <section className="py-12 md:py-16 px-4 texture-overlay">
        <div className="max-w-7xl mx-auto">
          {/* 分类标题和描述 */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-6xl text-charcoal mb-2">
              {categoryConfig?.icon} {categoryName}
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              {categoryName === '便当' && '精心准备的盒装美食，便携美味'}
              {categoryName === '自煮' && '自己动手，丰衣足食。每一顿都是用心'}
              {categoryName === '外卖' && '快手便利，品尝不同风味的选择'}
              {categoryName === 'Bakery' && '烘焙的艺术，每一口都是甜蜜'}
              {categoryName === '餐厅' && '走出家门，享受餐厅的精致氛围'}
            </p>
          </div>

          {/* 统计数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {/* 总数 */}
            <div
              className="bg-white rounded-2xl p-6 shadow-soft text-center"
              style={{
                borderTop: `4px solid ${categoryColor}`,
              }}
            >
              <div className="text-3xl md:text-4xl font-bold text-charcoal mb-1">
                {sortedMeals.length}
              </div>
              <div className="text-gray-600 text-sm md:text-base">条记录</div>
            </div>

            {/* 平均评分 */}
            <div
              className="bg-white rounded-2xl p-6 shadow-soft text-center"
              style={{
                borderTop: `4px solid ${categoryColor}`,
              }}
            >
              <div className="text-3xl md:text-4xl font-bold text-orange mb-1">
                ⭐ {avgRating}
              </div>
              <div className="text-gray-600 text-sm md:text-base">平均评分</div>
            </div>

            {/* 总消费 */}
            <div
              className="bg-white rounded-2xl p-6 shadow-soft text-center"
              style={{
                borderTop: `4px solid ${categoryColor}`,
              }}
            >
              <div className="text-3xl md:text-4xl font-bold text-green mb-1">
                ¥{totalCost}
              </div>
              <div className="text-gray-600 text-sm md:text-base">总消费</div>
            </div>

            {/* 平均单价 */}
            <div
              className="bg-white rounded-2xl p-6 shadow-soft text-center"
              style={{
                borderTop: `4px solid ${categoryColor}`,
              }}
            >
              <div className="text-3xl md:text-4xl font-bold text-charcoal mb-1">
                ¥{avgCost}
              </div>
              <div className="text-gray-600 text-sm md:text-base">平均单价</div>
            </div>
          </div>
        </div>
      </section>

      {/* 菜品网格 */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {sortedMeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedMeals.map((meal, index) => (
                <div
                  key={meal.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <MealCard meal={meal} categoryColor={categoryColor} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                该分类暂无记录 ✨
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-orange text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                返回首页
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 页脚 */}
      <Footer />
    </div>
  )
}