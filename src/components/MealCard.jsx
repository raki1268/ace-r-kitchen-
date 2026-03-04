import { Link } from 'react-router-dom'

export default function MealCard({ meal, categoryColor, hideRating = false, hidePrice = false, hideDate = false }) {
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

  // --- 统一后的路径逻辑 ---
  // 1. 优先取 images 数组的第一张，如果没有则尝试取旧的 image 字段
  const rawPath = (meal.images && meal.images.length > 0) ? meal.images[0] : (meal.image || '');

  // 2. 路径转换：
  //    - 如果以 "public/" 开头，去掉它变成以 "/" 开头
  //    - 如果既不以 "http" 开头也不以 "/" 开头（相对路径），补上 "/"
  let displayImage = rawPath.replace(/^public\//, '/');
  
  if (displayImage && !displayImage.startsWith('http') && !displayImage.startsWith('/')) {
    displayImage = '/' + displayImage;
  }
  // --- 逻辑结束 ---

  return (
    <Link to={`/meal/${meal.id}`}>
      <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-soft h-full">
        {/* 图片区域 */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
          <img
            src={displayImage}
            alt={meal.name}
            className="w-full h-full object-cover"
            // 加载失败时打印清晰的排查信息
            onError={(e) => {
              console.error(`图片加载失败! \n 菜品: ${meal.name} \n 原始数据: ${rawPath} \n 转换后尝试路径: ${displayImage}`);
              // 可选：设置一个备用占位图
              // e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
          
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: categoryColor }}
          >
            {meal.category}
          </div>
          
          {!hideRating && (
            <div className="absolute bottom-3 left-3 bg-white bg-opacity-95 rounded-lg p-2">
              {renderStars(meal.rating)}
            </div>
          )}
        </div>

        <div className="p-4 md:p-5">
          <h3 className="font-serif text-lg md:text-xl text-charcoal mb-2 line-clamp-2">
            {meal.name}
          </h3>

          <div className="flex justify-between items-center mb-3 text-xs md:text-sm text-gray-600">
            {!hideDate && <span>{meal.date}</span>}
            <span className="text-orange font-medium">{meal.cuisine}</span>
          </div>

          <p className="text-gray-700 text-xs md:text-sm line-clamp-2">
            {meal.notes}
          </p>

          {!hidePrice && meal.cost && (
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
              <span className="text-xs text-gray-500">消费</span>
              <span className="font-semibold text-orange text-sm md:text-base">
                ¥{meal.cost}
              </span>
            </div>
          )}
          
          {meal.makingTime && (
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
              <span className="text-xs text-gray-500">制作时间</span>
              <span className="font-semibold text-orange text-sm md:text-base">
                {meal.makingTime}mins
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}