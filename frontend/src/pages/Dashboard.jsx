import { useDashboard } from '../hooks/useDashboard'
import Card from '../components/ui/Card'
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react'
import Skeleton from '../components/ui/Skeleton'
import Badge from '../components/ui/Badge'

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard()
  if (isLoading) return <DashboardSkeleton />
  if (isError || !data?.success) return <div className="text-red-500">Error loading dashboard</div>

  const stats = data.data
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Package className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold">{stats.total_products}</div>
              <div className="text-sm text-slate-500">Total Products</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Users className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold">{stats.total_customers}</div>
              <div className="text-sm text-slate-500">Total Customers</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold">{stats.total_orders}</div>
              <div className="text-sm text-slate-500">Total Orders</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <DollarSign className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold">${stats.total_revenue.toFixed(2)}</div>
              <div className="text-sm text-slate-500">Total Revenue</div>
            </div>
          </div>
        </Card>
      </div>
      {/* Low stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Low Stock Products">
          {stats.low_stock_products.length > 0 ? (
            <ul className="space-y-2">
              {stats.low_stock_products.map(p => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>{p.name} ({p.sku})</span>
                  <span className="text-orange-600 font-medium">{p.quantity_in_stock} left</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">No low stock items</p>}
        </Card>
        <Card title="Recent Orders">
          {stats.recent_orders.slice(0,5).map(order => (
            <div key={order.id} className="flex justify-between py-1 text-sm border-b last:border-0">
              <span>#{order.id} - {order.customer_name}</span>
              <div className="flex gap-2 items-center">
                <Badge status={order.status} />
                <span className="font-medium">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({length:4}).map((_,i)=><div key={i} className="h-24 bg-slate-200 rounded-lg" />)}
      </div>
    </div>
  )
}