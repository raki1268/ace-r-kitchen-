import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import StarRating from '../components/StarRating'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/config'
import ShareActions from '../components/ShareActions' // 引入新组件

const getImageUrl = (rawPath) => {
  if (!rawPath) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop';
  if (rawPath.startsWith('http')) return rawPath;
  let displayImage = rawPath;
  if (displayImage.startsWith('public/')) displayImage = displayImage.replace('public/', '');
  if (displayImage.startsWith('/')) displayImage = displayImage.substring(1);
  const baseUrl = import.meta.env.BASE_URL;
  const fullBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${fullBase}${displayImage}`;
}

export default function DetailView({ meals }) {
  const { mealId } = useParams()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // 状态管理
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [showCloud, setShowCloud] = useState(false)
  const [joke, setJoke] = useState('')

  const foodJokes = [
    "谁家做饭这么香？哦，原来是我自己。",
    "唯有美食与爱不可辜负，但我选美食。",
    "我不是在吃，我是在为生活充电。",
    "吃饱了才有力气减肥。",
    "只要碗够大，我能装下整个宇宙。",
    "美食是治愈一切的良药，厨房是我的实验室。"
  ]

  // 精准置顶及数据初始化
  useEffect(() => {
    window.scrollTo(0, 0);
    setCheckedIngredients({});
  }, [mealId]);

  // 云朵梗逻辑（仅限 PC 端非打印模式）
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) return; 
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 100;
      
      if (scrollPosition > threshold && !showCloud) {
        setJoke(foodJokes[Math.floor(Math.random() * foodJokes.length)]);
        setShowCloud(true);
        setTimeout(() => setShowCloud(false), 5500);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showCloud]);

  const meal = meals.find((m) => m.id === mealId)

  const handleBackToCategory = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/category/${meal?.category}`);
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (!meal) return null;

  const categoryColor = CATEGORIES[meal.category]?.color || '#E8934A'
  const rawImages = Array.isArray(meal.images) ? meal.images : [meal.image || '']
  const images = rawImages.map(img => getImageUrl(img))
  const currentImage = images[currentImageIndex]

  // 图片轮播
  useEffect(() => {
    if (!meal || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [meal, images.length])

  return (
    <div className="min-h-screen bg-cream relative">
      <div className="no-print">
        <Header
          title="Ace.R's Kitchen"
          subtitle="家庭三餐精选"
          showBack={true}
          onBack={() => navigate('/')}
        />
      </div>

      {/* 面包屑与功能键 - 已集成 ShareActions */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-orange transition-colors">首页</button>
          <span>/</span>
          <button onClick={handleBackToCategory} className="hover:text-orange transition-colors">{meal.category}</button>
          <span>/</span>
          <span className="text-orange font-medium">{meal.name}</span>
        </div>
        
        {/* 这里是新组件：负责分享逻辑和打印触发 */}
        <ShareActions onPrint={() => window.print()} />
      </div>

      <main className="py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 大图轮播 */}
          <div className="mb-8 rounded-3xl overflow-hidden shadow-xl relative group">
            <img 
              src={currentImage} 
              alt={meal.name} 
              className="w-full h-80 md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs no-print">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* 标题区 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-3xl md:text-5xl text-charcoal mb-3">{meal.name}</h1>
                <div className="flex flex-wrap gap-3 items-center text-sm">
                  <span className="px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: categoryColor }}>
                    {CATEGORIES[meal.category]?.icon} {meal.category}
                  </span>
                  <span className="text-gray-500">📅 {meal.date}</span>
                </div>
              </div>
              <div className="md:text-right bg-orange/5 p-4 rounded-xl border border-orange/10">
                <div className="text-3xl font-bold text-orange">{meal.makingTime || meal.cost}{meal.makingTime ? 'm' : '¥'}</div>
                <div className="text-gray-400 text-xs uppercase tracking-tighter">{meal.makingTime ? 'Making Time' : 'Total Cost'}</div>
              </div>
            </div>

            {/* 流光进度条 */}
            {meal.category === 'Bakery' && (
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-gray-600">挑战难度</span>
                  <span className="text-orange">{meal.difficulty}%</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange shimmer-effect transition-all duration-1000"
                    style={{ width: `${meal.difficulty}%` }}
                  ></div>
                </div>
              </div>
            )}
            <p className="text-gray-700 text-lg font-serif italic text-center border-l-4 border-orange/20 px-4">"{meal.notes}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* 食材清单 - Checklist */}
            <div className="bg-white rounded-2xl p-6 shadow-soft" style={{ borderTop: `5px solid ${categoryColor}` }}>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">🥘 所需食材 <span className="text-xs font-normal text-gray-400 no-print">(点击标记)</span></h2>
              <ul className="space-y-2.5">
                {meal.ingredients.map((ing, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => toggleIngredient(idx)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${checkedIngredients[idx] ? 'bg-gray-50 border-transparent text-gray-300' : 'bg-orange/5 border-orange/10 text-gray-700 hover:border-orange/30'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checkedIngredients[idx] ? 'bg-gray-200 border-gray-200' : 'border-orange'}`}>
                      {checkedIngredients[idx] && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className={`text-sm md:text-base ${checkedIngredients[idx] ? 'line-through decoration-gray-300' : ''}`}>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 烹饪步骤 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft" style={{ borderTop: `5px solid ${categoryColor}` }}>
              <h2 className="text-xl font-bold mb-5">👨‍🍳 烹饪步骤</h2>
              <ol className="space-y-5">
                {meal.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold mt-1 shadow-sm">{idx + 1}</span>
                    <span className="text-gray-700 leading-[1.8] text-sm md:text-base">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
            <button onClick={handleBackToCategory} className="px-8 py-3 bg-white border-2 border-orange text-orange rounded-xl font-bold hover:bg-orange hover:text-white transition-all shadow-sm">
              返回{meal.category}列表
            </button>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-orange text-white rounded-xl font-bold shadow-lg shadow-orange/20 hover:-translate-y-1 transition-all">
              返回厨房首页
            </button>
          </div>
        </div>
      </main>

      {/* 云朵梗特效 */}
      {showCloud && (
        <div 
          onClick={() => setShowCloud(false)}
          className="cloud-joke-container fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] cursor-pointer no-print"
        >
          <div className="relative group">
            <span className="text-9xl text-white opacity-60 drop-shadow-md">☁️</span>
            <div className="absolute inset-0 flex items-center justify-center text-charcoal font-bold px-10 text-center text-sm leading-tight max-w-[200px] mx-auto">
              {joke}
            </div>
          </div>
        </div>
      )}

      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}