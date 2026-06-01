import { useState } from 'react'
import { useOrders, useCreateOrder, useCancelOrder } from '../hooks/useOrders'
import { useNavigate } from 'react-router-dom'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import OrderForm from '../components/orders/OrderForm'
import Badge from '../components/ui/Badge'
import { Plus, Eye, XCircle } from 'lucide-react'

export default function Orders() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading } = useOrders({ page, limit: 20, status: statusFilter })
  const createMutation = useCreateOrder()
  const cancelMutation = useCancelOrder()
  const navigate = useNavigate()

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Customer', accessor: 'customer_name' },
    { header: 'Total', accessor: 'total_amount', render: (row) => `$${parseFloat(row.total_amount).toFixed(2)}` },
    { header: 'Status', accessor: 'status', render: (row) => <Badge status={row.status} /> },
    { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
    { header: '', accessor: 'actions', render: (row) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${row.id}`)}><Eye size={14} /></Button>
        {row.status !== 'cancelled' && row.status !== 'completed' && (
          <Button variant="ghost" size="sm" onClick={() => cancelMutation.mutate(row.id)}><XCircle size={14} /></Button>
        )}
      </div>
    )},
  ]

  const handleCreate = async (formData) => {
    await createMutation.mutateAsync(formData)
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-1" /> New Order</Button>
      </div>
      <div className="flex gap-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Table columns={columns} data={data?.data} isLoading={isLoading} />
      <div className="flex justify-between">
        <Button variant="secondary" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button>
        <Button variant="secondary" disabled={!data?.data || data.data.length < 20} onClick={()=>setPage(p=>p+1)}>Next</Button>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <OrderForm onSubmit={handleCreate} isLoading={createMutation.isLoading} />
      </Modal>
    </div>
  )
}