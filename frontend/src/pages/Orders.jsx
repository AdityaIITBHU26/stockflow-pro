import { useState } from 'react'
import { useOrders, useCreateOrder, useCancelOrder } from '../hooks/useOrders'
import { useNavigate } from 'react-router-dom'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import OrderForm from '../components/orders/OrderForm'
import Badge from '../components/ui/Badge'
import { Plus, Eye, XCircle, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportToCSV } from '../utils/exportCSV'

export default function Orders() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  const params = { page, limit: 20 }
  if (statusFilter) params.status = statusFilter

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

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Customer', accessor: 'customer_name' },
    { header: 'Total', accessor: 'total_amount', render: (row) => `$${parseFloat(row.total_amount).toFixed(2)}` },
    { header: 'Status', accessor: 'status', render: (row) => <Badge status={row.status} /> },
    { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${row.id}`)}><Eye size={14} /></Button>
          {row.status !== 'cancelled' && row.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Cancel this order? Stock will be restored.')) cancelMutation.mutate(row.id)
              }}
            >
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
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2"><Button variant="secondary" onClick={() => { if (orders.length) exportToCSV(orders, 'orders.csv') }}><Download size={16} className="mr-1" /> Export</Button><Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-1" /> New Order</Button></div>
      </div>
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Table columns={columns} data={orders} isLoading={isLoading} />
      <div className="flex justify-between items-center">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-slate-500">Page {page} (Total: {data?.total || 0})</span>
        <Button variant="secondary" disabled={orders.length < 20} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <OrderForm onSubmit={handleCreate} isLoading={createMutation.isLoading} />
      </Modal>
    </div>
  )
}
