import { Link } from 'react-router-dom'

export default function MealCard({ meal, categoryColor }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < Math.floor(rating) ? 'text-orange' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <Link to={`/meal/${meal.id}`}>
      <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-soft h-full">
        {/* 图片区域 */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=400&fit=crop'
            }}
          />
          {/* 分类标签 */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: categoryColor }}
          >
            {meal.category}
          </div>
          {/* 评分浮动 */}
          <div className="absolute bottom-3 left-3 bg-white bg-opacity-95 rounded-lg p-2">
            {renderStars(meal.rating)}
          </div>
        </div>

        {/* 信息区域 */}
        <div className="p-4 md:p-5">
          {/* 名称 */}
          <h3 className="font-serif text-lg md:text-xl text-charcoal mb-2 line-clamp-2">
            {meal.name}
          </h3>

          {/* 日期和菜系 */}
          <div className="flex justify-between items-center mb-3 text-xs md:text-sm text-gray-600">
            <span>{meal.date}</span>
            <span className="text-orange font-medium">{meal.cuisine}</span>
          </div>

          {/* 预览描述 */}
          <p className="text-gray-700 text-xs md:text-sm line-clamp-2">
            {meal.notes}
          </p>
        </div>
      </div>
    </Link>
  )
}