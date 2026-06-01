export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="text-sm text-slate-500">Welcome back</div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
          S
        </div>
      </div>
    </header>
  )
}