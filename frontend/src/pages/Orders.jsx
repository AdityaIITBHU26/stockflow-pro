import { useState } from 'react'
import { useOrders, useCreateOrder, useCancelOrder } from '../hooks/useOrders'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import OrderForm from '../components/orders/OrderForm'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { Plus, Eye, XCircle, Download, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportToCSV } from '../utils/exportCSV'

export default function Orders() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState(null)
  const navigate = useNavigate()

  const params = { page, limit: 20, sort_by: sortBy, sort_order: sortOrder }
  if (statusFilter) params.status = statusFilter
  if (dateFrom) params.date_from = dateFrom
  if (dateTo) params.date_to = dateTo

  const { data, isLoading, isError, error } = useOrders(params)
  const createMutation = useCreateOrder()
  const cancelMutation = useCancelOrder()

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Failed to load orders: {error.message}
        <br />
        <button onClick={() => window.location.reload()} className="underline mt-2">Retry</button>
      </div>
    )
  }

  const orders = data?.data || []

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Customer', accessor: 'customer_name', sortable: true },
    { header: 'Total', accessor: 'total_amount', render: (row) => `$${parseFloat(row.total_amount).toFixed(2)}`, sortable: true },
    { header: 'Status', accessor: 'status', render: (row) => <Badge status={row.status} /> },
    { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString(), sortable: true },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${row.id}`)}><Eye size={14} /></Button>
          {row.status !== 'cancelled' && row.status !== 'completed' && (
            <Button variant="ghost" size="sm" onClick={() => setCancelTarget(row)}>
              <XCircle size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const handleCreate = async (formData) => {
    try {
      await createMutation.mutateAsync(formData)
      setModalOpen(false)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Orders</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { if (orders.length) exportToCSV(orders, 'orders.csv') }}><Download size={16} className="mr-1" /> Export</Button>
          <Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-1" /> New Order</Button>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap items-end">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">From:</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">To:</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => col.sortable && handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortBy === col.accessor && (
                      sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {orders.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">No orders found</div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-slate-500 dark:text-slate-400">Page {page} (Total: {data?.total || 0})</span>
        <Button variant="secondary" disabled={orders.length < 20} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <OrderForm onSubmit={handleCreate} isLoading={createMutation.isLoading} />
      </Modal>

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelMutation.mutate(cancelTarget.id)}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${cancelTarget?.id}? Stock will be restored.`}
      />
    </div>
  )
}
