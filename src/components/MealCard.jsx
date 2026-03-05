import { Link } from 'react-router-dom'

// 辅助函数：统一处理图片路径（支持 CodeSpaces 环境和子路径）
const getImageUrl = (rawPath) => {
  if (!rawPath) return '';
  if (rawPath.startsWith('http')) return rawPath;

  let displayImage = rawPath;
  if (displayImage.startsWith('public/')) {
    displayImage = displayImage.replace('public/', '');
  }
  if (displayImage.startsWith('/')) {
    displayImage = displayImage.substring(1);
  }

  const baseUrl = import.meta.env.BASE_URL;
  const fullBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  return `${fullBase}${displayImage}`;
}

export default function MealCard({ meal, categoryColor, hidePrice = false, hideDate = false }) {
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
              console.error(`图片加载失败! 菜品: ${meal.name}, 路径: ${displayImage}`);
            }}
          />
          
          {/* 分类标签 */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: categoryColor }}
          >
            {meal.category}
          </div>
          
          {/* 注意：这里的星星评分代码已被移除，实现首页和分类页的简洁显示 */}
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