import { Link } from 'react-router-dom'

export default function Header({ title, subtitle, showBack = false, onBack }) {
  return (
    <header className="bg-cream border-b border-orange border-opacity-20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl md:text-3xl">🍽️</span>
          <div>
            <h1 className="font-display text-lg md:text-2xl text-charcoal font-bold">
              {title}
            </h1>
            {subtitle && (
              <p className="font-serif text-xs md:text-sm text-gray-600 italic">
                {subtitle}
              </p>
            )}
          </div>
        </Link>

        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange text-white hover:bg-orange transition-colors text-sm md:text-base"
          >
            ← 返回
          </button>
        )}
      </div>
    </header>
  )
}