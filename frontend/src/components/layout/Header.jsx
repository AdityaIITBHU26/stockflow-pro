import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function Header() {
  const { dark, toggle } = useTheme()
  const [logo, setLogo] = useState(null)

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
