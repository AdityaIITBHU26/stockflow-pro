import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../api/products'
import toast from 'react-hot-toast'

export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getAll(params),
    keepPreviousData: true,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      qc.invalidateQueries('products')
      toast.success('Product created')
    },
    onError: (err) => toast.error(err.message),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries('products')
      toast.success('Product updated')
    },
    onError: (err) => toast.error(err.message),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      qc.invalidateQueries('products')
      toast.success('Product deleted')
    },
    onError: (err) => toast.error(err.message),
  })
}