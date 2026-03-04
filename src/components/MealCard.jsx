import { Link } from 'react-router-dom'

const getImageUrl = (rawPath) => {
  if (!rawPath) return '';
  
  // 1. 如果是网络图片，直接返回
  if (rawPath.startsWith('http')) return rawPath;

  let displayImage = rawPath;

  // 2. 去掉 public/ 前缀（如果有）
  if (displayImage.startsWith('public/')) {
    displayImage = displayImage.replace('public/', '');
  }

  // 3. 统一去掉开头的斜杠，方便后续拼接
  if (displayImage.startsWith('/')) {
    displayImage = displayImage.substring(1);
  }

  // 4. 关键修复：使用 Vite 的 BASE_URL 自动拼接路径
  // 它会自动处理成 /ace-r-kitchen-/images/bakery/...
  const baseUrl = import.meta.env.BASE_URL; // 获取 vite.config.js 里的 base
  
  // 确保 baseUrl 以 / 结尾，displayImage 不以 / 开头
  const fullBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  return `${fullBase}${displayImage}`;
}

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

  // 获取第一张图片并转换路径
  const rawPath = (meal.images && meal.images.length > 0) ? meal.images[0] : (meal.image || '');
  const displayImage = getImageUrl(rawPath);

  return (
    <Link to={`/meal/${meal.id}`}>
      <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-soft h-full">
        {/* 图片区域 */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
          <img
            src={displayImage}
            alt={meal.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`图片加载失败! 菜品: ${meal.name}, 原始数据: ${rawPath}, 转换后路径: ${displayImage}`);
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