import { useDashboard } from '../hooks/useDashboard'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from '../api/orders'
import Card from '../components/ui/Card'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import Skeleton from '../components/ui/Skeleton'
import Badge from '../components/ui/Badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444']

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard()
  const { data: ordersData } = useQuery({
    queryKey: ['orders', { limit: 100 }],
    queryFn: () => orderApi.getAll({ limit: 100 }),
    staleTime: 60000,
  })

  if (isLoading) return <DashboardSkeleton />
  if (isError || !data?.success) return <div className="text-red-500">Error loading dashboard</div>

  const stats = data.data

  // Aggregate revenue by date for chart
  const revenueByDate = (ordersData?.data || []).reduce((acc, order) => {
    const date = new Date(order.created_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + parseFloat(order.total_amount)
    return acc
  }, {})
  const revenueData = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue: Math.round(revenue * 100) / 100,
  })).sort((a, b) => new Date(a.date) - new Date(b.date))

  // Top customers by order count
  const customerOrderCount = (ordersData?.data || []).reduce((acc, order) => {
    const name = order.customer_name
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})
  const topCustomers = Object.entries(customerOrderCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Status breakdown for pie chart
  const chartData = stats.order_status_breakdown
    ? Object.entries(stats.order_status_breakdown).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Package className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold dark:text-white">{stats.total_products}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Products</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Users className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold dark:text-white">{stats.total_customers}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Customers</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold dark:text-white">{stats.total_orders}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Orders</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <DollarSign className="text-primary-500" />
            <div>
              <div className="text-2xl font-bold dark:text-white">${stats.total_revenue.toFixed(2)}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Revenue Trend">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No order data yet</p>
          )}
        </Card>

        <Card title="Order Status">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No orders yet</p>
          )}
        </Card>
      </div>

      {/* Low stock & recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Low Stock Products">
          {stats.low_stock_products.length > 0 ? (
            <ul className="space-y-2">
              {stats.low_stock_products.map(p => (
                <li key={p.id} className="flex justify-between text-sm dark:text-white">
                  <span>{p.name} ({p.sku})</span>
                  <span className="text-orange-600 font-medium">{p.quantity_in_stock} left</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500 dark:text-slate-400">No low stock items</p>}
        </Card>
        <Card title="Recent Orders">
          {stats.recent_orders.slice(0,5).map(order => (
            <div key={order.id} className="flex justify-between py-1 text-sm border-b last:border-0 dark:border-slate-700 dark:text-white">
              <span>#{order.id} - {order.customer_name}</span>
              <div className="flex gap-2 items-center">
                <Badge status={order.status} />
                <span className="font-medium">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Top customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Top Customers">
          {topCustomers.length > 0 ? (
            <ul className="space-y-2">
              {topCustomers.map((c, idx) => (
                <li key={idx} className="flex justify-between text-sm dark:text-white">
                  <span>{c.name}</span>
                  <span className="font-medium">{c.count} orders</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No customer data</p>
          )}
        </Card>
        <Card title="Top Selling Products">
          {stats.top_selling_products?.length > 0 ? (
            <ul className="space-y-2">
              {stats.top_selling_products.map((p, idx) => (
                <li key={idx} className="flex justify-between text-sm dark:text-white">
                  <span>{p.name}</span>
                  <span className="font-medium">{p.total_sold} sold</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500 dark:text-slate-400">No sales data</p>}
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({length:4}).map((_,i)=><div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />)}
      </div>
    </div>
  )
}
