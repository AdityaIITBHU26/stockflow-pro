import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api/orders'
import toast from 'react-hot-toast'

export function useOrders(params) {
  const cleanParams = { ...params }
  if (!cleanParams.status) delete cleanParams.status
  if (!cleanParams.search) delete cleanParams.search
  if (!cleanParams.date_from) delete cleanParams.date_from
  if (!cleanParams.date_to) delete cleanParams.date_to

  return useQuery({
    queryKey: ['orders', cleanParams],
    queryFn: () => orderApi.getAll(cleanParams),
    keepPreviousData: true,
  })
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order placed')
    },
    onError: (err) => toast.error(err.message),
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.cancel,
    onSuccess: (_, orderId) => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['order', orderId] })
      toast.success('Order cancelled')
    },
    onError: (err) => toast.error(err.message),
  })
}
