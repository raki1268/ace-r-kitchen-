import { SOCIAL_LINKS, SITE_INFO } from '../data/config'

export default function Footer() {
  return (
    /* 核心修改：添加了 no-print，确保打印配方时不显示页脚 */
    <footer className="bg-charcoal text-white mt-16 md:mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* 主要内容 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* 品牌信息 */}
          <div className="animate-fade-in">
            <h3 className="font-display text-2xl md:text-3xl mb-2 text-orange">
              {SITE_INFO?.title || 'Ace.R Kitchen'}
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-serif italic">
              {SITE_INFO?.description}
            </p>
          </div>

          {/* 快速导航 */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-200">快速导航</h4>
            <ul className="space-y-3 text-sm md:text-base text-gray-400">
              <li key="home">
                <a
                  href="/"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-orange transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">▶</span> 首页
                </a>
              </li>
              <li key="about">
                <a
                  href="#"
                  className="hover:text-orange transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">▶</span> 关于我们
                </a>
              </li>
              <li key="contact">
                <a
                  href="#"
                  className="hover:text-orange transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">▶</span> 联系反馈
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-200">关注我们</h4>
            <div className="flex flex-wrap gap-4">
              {SOCIAL_LINKS?.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  title={link.label}
                  className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-orange hover:scale-110 transition-all text-xl shadow-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 分割线与版权 */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-500">
          <p className="tracking-wide">
            © {SITE_INFO?.year || new Date().getFullYear()} {SITE_INFO?.title}. 保留所有权利。
          </p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <span className="text-orange animate-pulse">🍽️</span>
            <span>and</span>
            <span className="text-red-400">❤️</span>
          </div>
        </div>
      </div>
    </footer>
  )
}