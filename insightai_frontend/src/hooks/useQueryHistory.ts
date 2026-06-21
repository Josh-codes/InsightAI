import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryApi } from '../services/api'

export interface QueryResult {
  id: number
  natural_language: string
  generated_sql: string
  result_data: Record<string, unknown>[]
  chart_type: 'bar' | 'line' | 'table'
  insight: string
  execution_time_ms: number
  cached: boolean
}

export const useRunQuery = (datasetId: number) => {
  const [lastResult, setLastResult] = useState<QueryResult | null>(null)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (nl: string) => queryApi.run(datasetId, nl).then((r) => r.data.data),
    onSuccess: (data) => {
      setLastResult(data)
      qc.invalidateQueries({ queryKey: ['query-history', datasetId] })
    },
  })

  return { run: mutation.mutate, isLoading: mutation.isPending, result: lastResult, error: mutation.error }
}

export const useQueryHistory = (datasetId: number) =>
  useQuery({
    queryKey: ['query-history', datasetId],
    queryFn: () => queryApi.history(datasetId).then((r) => r.data.data),
    enabled: !!datasetId,
  })

export const useDeleteQueryHistory = (datasetId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => queryApi.deleteHistory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['query-history', datasetId] }),
  })
}
