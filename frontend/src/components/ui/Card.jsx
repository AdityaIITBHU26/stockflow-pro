export default function Card({ title, children, className }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-slate-500 mb-2">{title}</h3>}
      {children}
    </div>
  )
}