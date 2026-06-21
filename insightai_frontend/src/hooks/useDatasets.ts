import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { datasetApi } from '../services/api'

export const useDatasets = () =>
  useQuery({ queryKey: ['datasets'], queryFn: () => datasetApi.list().then((r) => r.data.data) })

export const useDataset = (id: number) =>
  useQuery({
    queryKey: ['dataset', id],
    queryFn: () => datasetApi.detail(id).then((r) => r.data.data),
    enabled: !!id,
  })

export const useDeleteDataset = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => datasetApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['datasets'] }),
  })
}
