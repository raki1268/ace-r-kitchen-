export default function StarRating({ rating, size = 'md' }) {
  const sizeMap = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <div className="flex gap-2 items-center">
      <div className={`flex gap-1 ${sizeMap[size]}`}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`transition-colors ${
              i < Math.floor(rating)
                ? 'text-orange'
                : i < rating
                ? 'text-orange'
                : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-gray-600 text-sm font-medium">
        {rating.toFixed(1)}/5
      </span>
    </div>
  )
}