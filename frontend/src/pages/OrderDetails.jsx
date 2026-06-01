import { useParams, useNavigate } from 'react-router-dom'
import { useOrder, useCancelOrder } from '../hooks/useOrders'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { ArrowLeft, XCircle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api/orders'
import toast from 'react-hot-toast'

export default function OrderDetails() {
  const { id } = useParams()
  const { data, isLoading } = useOrder(id)
  const cancelMutation = useCancelOrder()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', id])
      toast.success('Status updated')
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!data?.success) return <div className="text-red-500">Order not found</div>
  const order = data.data

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={16} /></Button>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <Badge status={order.status} />
      </div>
      <div className="bg-white rounded-lg border p-4 space-y-2">
        <p><span className="font-medium">Customer:</span> {order.customer_name}</p>
        <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
        <p><span className="font-medium">Total:</span> ${parseFloat(order.total_amount).toFixed(2)}</p>
      </div>
      {order.status !== 'cancelled' && order.status !== 'completed' && (
        <div className="bg-white rounded-lg border p-4">
          <label className="block text-sm font-medium mb-2">Update Status</label>
          <select
            value={order.status}
            onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          {updateStatusMutation.isLoading && <span className="ml-2 text-sm">Updating...</span>}
        </div>
      )}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr><th className="text-left py-2">Product</th><th className="text-right">Qty</th><th className="text-right">Unit Price</th><th className="text-right">Subtotal</th></tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-2">{item.product_name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">${parseFloat(item.unit_price).toFixed(2)}</td>
                <td className="text-right">${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {order.status !== 'cancelled' && order.status !== 'completed' && (
        <Button variant="danger" onClick={() => cancelMutation.mutate(order.id)}>
          <XCircle size={16} className="mr-1" /> Cancel Order
        </Button>
      )}
    </div>
  )
}
