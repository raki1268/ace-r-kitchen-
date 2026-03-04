import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import StarRating from '../components/StarRating'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/config'

// 辅助函数：统一处理图片路径（支持 CodeSpaces 环境）
const getImageUrl = (rawPath) => {
  if (!rawPath) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop'
  
  let displayImage = rawPath;

  // 如果是以 public/ 开头，去掉 public
  if (displayImage.startsWith('public/')) {
    displayImage = '/' + displayImage.replace('public/', '');
  }

  // 如果既不是 http 也不是 /，加 /
  if (displayImage && !displayImage.startsWith('http') && !displayImage.startsWith('/')) {
    displayImage = '/' + displayImage;
  }

  // 关键修复：不要用 import.meta.url，直接返回相对根目录的路径
  // Vite 会自动识别并从 public 文件夹加载
  return displayImage;
}

export default function DetailView({ meals }) {
  const { mealId } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const meal = meals.find((m) => m.id === mealId)

  // 图片轮播 - 3秒自动切换
  useEffect(() => {
    if (!meal || !Array.isArray(meal.images) || meal.images.length <= 1) {
      return
    }

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % meal.images.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [meal])

  if (!meal) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header title="Ace.R's Kitchen" subtitle="家庭三餐精选" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-2xl text-gray-500 mb-4">菜品不存在 :(</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-orange text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const categoryColor = CATEGORIES[meal.category]?.color || '#E8934A'
  
  // 获取图片数组 - 使用路径转换
  const rawImages = Array.isArray(meal.images) ? meal.images : [meal.image || '']
  const images = rawImages.map(img => getImageUrl(img))
  const currentImage = images[currentImageIndex]

  // 前一张图片
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // 下一张图片
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* 头部 */}
      <Header
        title="Ace.R's Kitchen"
        subtitle="家庭三餐精选"
        showBack={true}
        onBack={() => navigate('/')}
      />

      {/* 面包屑导航 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-orange transition-colors"
          >
            首页
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate(`/category/${meal.category}`)}
            className="hover:text-orange transition-colors"
          >
            {meal.category}
          </button>
          <span>/</span>
          <span className="text-orange font-medium">{meal.name}</span>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 大图展示 - 支持轮播 */}
          <div className="mb-8 md:mb-12 rounded-3xl overflow-hidden shadow-medium animate-fade-in relative group">
            <img
              src={currentImage}
              alt={meal.name}
              className="w-full h-96 md:h-[500px] object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop'
              }}
            />

            {/* 图片计数器 */}
            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* 左右按钮 - 多张图片时显示 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-charcoal rounded-full w-10 h-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  title="上一张"
                >
                  ‹
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 text-charcoal rounded-full w-10 h-10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  title="下一张"
                >
                  ›
                </button>

                {/* 图片指示点 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-orange w-6'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 基本信息 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft mb-8 animate-slide-up">
            {/* 标题行 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-3xl md:text-5xl text-charcoal mb-2">
                  {meal.name}
                </h1>
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className="px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {CATEGORIES[meal.category]?.icon} {meal.category}
                  </span>
                  <span className="text-gray-600 text-sm">
                    📅 {meal.date}
                  </span>
                  <span className="text-gray-600 text-sm">
                    🍴 {meal.cuisine}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {meal.makingTime ? (
                  <>
                    <div className="text-3xl md:text-4xl font-bold text-orange mb-2">
                      {meal.makingTime}mins
                    </div>
                    <div className="text-gray-600 text-sm">制作时间</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl md:text-4xl font-bold text-orange mb-2">
                      ¥{meal.cost}
                    </div>
                    <div className="text-gray-600 text-sm">消费金额</div>
                  </>
                )}
              </div>
            </div>

            {/* 分割线 */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* 评分和评语 */}
            <div className="mb-6">
              <div className="mb-4">
                <StarRating rating={meal.rating} size="lg" />
              </div>
              <p className="text-gray-800 text-base md:text-lg font-serif italic">
                "{meal.notes}"
              </p>
            </div>
          </div>

          {/* 配方和步骤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* 所需食材 */}
            <div
              className="bg-white rounded-2xl p-6 md:p-8 shadow-soft"
              style={{
                borderLeft: `4px solid ${categoryColor}`,
              }}
            >
              <h2 className="font-display text-2xl text-charcoal mb-4 flex items-center gap-2">
                🥘 所需食材
              </h2>
              <ul className="space-y-3">
                {meal.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor }}></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {/* 烹饪步骤 */}
            <div
              className="bg-white rounded-2xl p-6 md:p-8 shadow-soft"
              style={{
                borderLeft: `4px solid ${categoryColor}`,
              }}
            >
              <h2 className="font-display text-2xl text-charcoal mb-4 flex items-center gap-2">
                👨‍🍳 烹饪步骤
              </h2>
              <ol className="space-y-3">
                {meal.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 装饰分割线 */}
          <div className="flex justify-center mb-8">
            <span className="text-3xl">🥣</span>
          </div>

          {/* 底部导航 */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/category/${meal.category}`)}
              className="px-6 py-3 bg-white border-2 border-orange text-orange rounded-lg hover:bg-orange hover:text-white transition-colors font-medium"
            >
              查看{meal.category}分类
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              返回首页
            </button>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  )
}