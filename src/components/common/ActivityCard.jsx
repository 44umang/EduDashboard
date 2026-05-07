const ActivityCard = ({ title, subtitle, time, className = '' }) => {
  return (
    <div className={`p-4 rounded-xl bg-white shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
      </div>
    </div>
  )
}

export default ActivityCard
