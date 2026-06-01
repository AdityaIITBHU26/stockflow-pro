import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api/orders'
import toast from 'react-hot-toast'

export function useOrders(params) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getAll(params),
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
      qc.invalidateQueries('orders')
      toast.success('Order placed')
    },
    onError: (err) => toast.error(err.message),
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries('orders')
      toast.success('Order cancelled')
    },
    onError: (err) => toast.error(err.message),
  })
}