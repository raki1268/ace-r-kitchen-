import { SOCIAL_LINKS, SITE_INFO } from '../data/config'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* 主要内容 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* 品牌信息 */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl mb-2">
              {SITE_INFO.title}
            </h3>
            <p className="text-gray-300 text-sm md:text-base font-serif italic">
              {SITE_INFO.description}
            </p>
          </div>

          {/* 快速导航 */}
          <div>
            <h4 className="font-semibold text-lg mb-4">快速导航</h4>
            <ul className="space-y-2 text-sm md:text-base text-gray-300">
              <li key="home">
                
                  href="/"
                  className="hover:text-orange transition-colors"
                >
                  首页
                </a>
              </li>
              <li key="about">
                
                  href="#"
                  className="hover:text-orange transition-colors"
                >
                  关于
                </a>
              </li>
              <li key="contact">
                
                  href="#"
                  className="hover:text-orange transition-colors"
                >
                  联系
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h4 className="font-semibold text-lg mb-4">关注我们</h4>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                
                  key={link.name}
                  href={link.url}
                  title={link.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange transition-colors text-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
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

        {/* 分割线 */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            © {SITE_INFO.year} {SITE_INFO.title}. 保留所有权利。
          </p>
          <p>
            Made with 🍽️ and ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}