import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerApi } from '../api/customers'
import toast from 'react-hot-toast'

export function useCustomers(params) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerApi.getAll(params),
    keepPreviousData: true,
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      qc.invalidateQueries('customers')
      toast.success('Customer created')
    },
    onError: (err) => toast.error(err.message),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      qc.invalidateQueries('customers')
      toast.success('Customer deleted')
    },
    onError: (err) => toast.error(err.message),
  })
}