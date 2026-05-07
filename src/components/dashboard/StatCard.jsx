const StatCard = ({ label, value, icon, color = '#3b82f6', className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 flex items-center gap-4 ${className}`} style={{ borderColor: color }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
    </div>
  )
}

export default StatCard