import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products', badgeQuery: true },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
]

export default function Sidebar() {
  const { data: dashData } = useDashboard()
  const lowStockCount = dashData?.data?.low_stock_products?.length || 0

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xl font-bold text-primary-600">StockFlow Pro</span>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-3">
        {links.map(({ to, icon: Icon, label, badgeQuery }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`
            }
          >
            <Icon size={18} />
            {label}
            {badgeQuery && lowStockCount > 0 && (
              <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                {lowStockCount} low
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
