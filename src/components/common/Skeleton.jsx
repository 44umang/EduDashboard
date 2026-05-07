export const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
)

export const SkeletonCards = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-200">
        <SkeletonBlock className="h-4 w-24 mb-3" />
        <SkeletonBlock className="h-8 w-16" />
      </div>
    ))}
  </div>
)

export const SkeletonTable = ({ rows = 6, cols = 5 }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-100">
      <SkeletonBlock className="h-5 w-40" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }, (_, rowIdx) => (
        <div key={rowIdx} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }, (_, colIdx) => (
            <SkeletonBlock key={colIdx} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  </div>
)

