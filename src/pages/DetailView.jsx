import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import StarRating from '../components/StarRating'
import Footer from '../components/Footer'
import { CATEGORIES } from '../data/config'
import ShareActions from '../components/ShareActions'

// 外部计数器，用于判断单双数（跨页面累加）
let globalEffectCount = 1;

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
  
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [showCloud, setShowCloud] = useState(false)
  const [showFountain, setShowFountain] = useState(false)
  const [hasShownEffect, setHasShownEffect] = useState(false) 

  // 弹球物理参数引用
  const cloudRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const requestRef = useRef();

  // 1. 切换页面重置
  useEffect(() => {
    window.scrollTo(0, 0);
    setCheckedIngredients({});
    setHasShownEffect(false); 
  }, [mealId]);

  // 2. 弹球物理动画引擎
  const animate = () => {
    if (!cloudRef.current) return;

    // 更新位置坐标
    pos.current.x += pos.current.vx;
    pos.current.y += pos.current.vy;

    const rect = cloudRef.current.getBoundingClientRect();
    const padding = 10;

    // 左右边界检测与反弹
    if (pos.current.x <= padding || pos.current.x >= window.innerWidth - rect.width - padding) {
      pos.current.vx *= -1;
    }
    // 顶部与底部检测与反弹
    if (pos.current.y <= padding || pos.current.y >= window.innerHeight - rect.height - padding) {
      pos.current.vy *= -1;
    }

    // 应用位移
    cloudRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    requestRef.current = requestAnimationFrame(animate);
  };

  // 3. 滚动监听与特效触发
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024 || hasShownEffect) return; 
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 50;
      
      if (scrollPosition > threshold) {
        setHasShownEffect(true); 
        
        if (globalEffectCount % 2 !== 0) {
          // 单数次：初始化“硬核弹球云”
          pos.current = {
            x: window.innerWidth / 2 - 50,
            y: window.innerHeight - 150,
            vx: (Math.random() - 0.5) * 20, // 随机水平初速度
            vy: -12 - Math.random() * 8     // 强力向上弹射
          };
          setShowCloud(true);
          // 8秒后停止动画并消失
          setTimeout(() => {
            setShowCloud(false);
            cancelAnimationFrame(requestRef.current);
          }, 8000);
        } else {
          // 双数次：触发喷泉
          setShowFountain(true);
          setTimeout(() => setShowFountain(false), 4000);
        }
        globalEffectCount++; 
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShownEffect]);

  // 4. 动画帧生命周期管理
  useEffect(() => {
    if (showCloud) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [showCloud]);

  const meal = meals.find((m) => m.id === mealId)
  if (!meal) return null;

  const handleBackToCategory = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/category/${meal?.category}`);
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] }));
  };

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
    <div className="min-h-screen bg-cream relative overflow-x-hidden">
      <div className="no-print">
        <Header title="Ace.R's Kitchen" subtitle="家庭三餐精选" showBack={true} onBack={() => navigate('/')} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-orange">首页</button>
          <span>/</span>
          <button onClick={handleBackToCategory} className="hover:text-orange">{meal.category}</button>
          <span>/</span>
          <span className="text-orange font-medium">{meal.name}</span>
        </div>
        <ShareActions onPrint={() => window.print()} />
      </div>

      <main className="py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 大图展示 */}
          <div className="mb-8 rounded-3xl overflow-hidden shadow-xl relative group">
            <img src={currentImage} alt={meal.name} className="w-full h-80 md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>

          {/* 详情卡片 */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-3xl md:text-5xl text-charcoal mb-3">{meal.name}</h1>
                <div className="flex flex-wrap gap-3 items-center text-sm">
                  <span className="px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: categoryColor }}>
                    {CATEGORIES[meal.category]?.icon} {meal.category}
                  </span>
                </div>
              </div>
              <div className="md:text-right bg-orange/5 p-4 rounded-xl border border-orange/10">
                <div className="text-3xl font-bold text-orange">{meal.makingTime || meal.cost}{meal.makingTime ? 'm' : '¥'}</div>
                <div className="text-gray-400 text-[10px] uppercase tracking-tighter">Information</div>
              </div>
            </div>

            {meal.category === 'Bakery' && (
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-gray-600">挑战难度</span>
                  <span className="text-orange">{meal.difficulty}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange shimmer-effect transition-all duration-1000" style={{ width: `${meal.difficulty}%` }}></div>
                </div>
              </div>
            )}
            <p className="text-gray-700 text-lg font-serif italic text-center border-l-4 border-orange/20 px-4">"{meal.notes}"</p>
          </div>

          {/* 食材与步骤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-soft" style={{ borderTop: `5px solid ${categoryColor}` }}>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">🥘 所需食材</h2>
              <ul className="space-y-2.5">
                {meal.ingredients.map((ing, idx) => (
                  <li key={idx} onClick={() => toggleIngredient(idx)} className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${checkedIngredients[idx] ? 'bg-gray-50 border-transparent text-gray-300' : 'bg-orange/5 border-orange/10 text-gray-700'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${checkedIngredients[idx] ? 'bg-gray-200 border-gray-200' : 'border-orange'}`}>
                      {checkedIngredients[idx] && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className={`text-sm ${checkedIngredients[idx] ? 'line-through' : ''}`}>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft" style={{ borderTop: `5px solid ${categoryColor}` }}>
              <h2 className="text-xl font-bold mb-5">👨‍🍳 烹饪步骤</h2>
              <ol className="space-y-5">
                {meal.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold mt-1">{idx + 1}</span>
                    <span className="text-gray-700 leading-relaxed text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
            <button onClick={handleBackToCategory} className="px-8 py-3 bg-white border-2 border-orange text-orange rounded-xl font-bold hover:bg-orange hover:text-white transition-all">返回列表</button>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-orange text-white rounded-xl font-bold transition-all">返回首页</button>
          </div>
        </div>
      </main>

      {/* 特效 A: 弹球云 (取消文字) */}
      {showCloud && (
        <div 
          ref={cloudRef}
          onClick={() => setShowCloud(false)}
          className="fixed z-[1000] cursor-pointer no-print pointer-events-auto"
          style={{ left: 0, top: 0, willChange: 'transform' }}
        >
          <span className="text-8xl md:text-9xl opacity-60 drop-shadow-2xl select-none">☁️</span>
        </div>
      )}

      {/* 特效 B: 🎉🍱 喷泉 */}
      {showFountain && (
        <div className="no-print">
          {[...Array(12)].map((_, i) => (
            <span 
              key={i} 
              className="fountain-particle text-3xl"
              style={{ 
                '--tw-translate-x': `${(Math.random() - 0.5) * 600}px`,
                '--tw-rotate': `${Math.random() * 360}deg`,
                animationDelay: `${Math.random() * 0.5}s`,
                left: `${40 + Math.random() * 20}%`
              }}
            >
              {i % 2 === 0 ? '🎉' : '🍱'}
            </span>
          ))}
        </div>
      )}

      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}