import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Moon, Sun, Bell } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'

export default function Header() {
  const { dark, toggle } = useTheme()
  const [logo, setLogo] = useState(null)
  const { data: dashData } = useDashboard()
  const lowStockCount = dashData?.data?.low_stock_products?.length || 0

  useEffect(() => {
    const saved = localStorage.getItem('profile')
    if (saved) {
      try {
        const profile = JSON.parse(saved)
        if (profile.logo) setLogo(profile.logo)
      } catch (e) {}
    }
  }, [])

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
      <div className="text-sm text-slate-500 dark:text-slate-400">Welcome back</div>
      <div className="flex items-center gap-4">
        <Link
          to="/products?search=&category=&sort_by=quantity_in_stock&sort_order=asc"
          className="relative p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          title="Low stock alerts"
        >
          <Bell size={18} />
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {lowStockCount}
            </span>
          )}
        </Link>
        <button
          onClick={toggle}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          title="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {logo ? (
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
            S
          </div>
        )}
      </div>
    </header>
  )
}
