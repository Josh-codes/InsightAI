import { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { datasetApi } from '../../services/api'
import ErrorBanner from '../Common/ErrorBanner'

const MAX_SIZE = 50 * 1024 * 1024

export default function UploadCard() {
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const qc = useQueryClient()

  const handleFile = async (file: File) => {
    setError('')
    if (file.size > MAX_SIZE) {
      setError('File exceeds 50MB limit.')
      return
    }
    if (!/\.(csv|xlsx|xls)$/i.test(file.name)) {
      setError('Only CSV and Excel files are supported.')
      return
    }
    setUploading(true)
    setProgress(0)
    try {
      await datasetApi.upload(file, file.name.replace(/\.[^.]+$/, ''))
      qc.invalidateQueries({ queryKey: ['datasets'] })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      {error && <ErrorBanner message={error} />}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging ? 'border-primary bg-primary/10' : 'border-slate-600 hover:border-slate-400'
        }`}
      >
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" onChange={onChange} className="hidden" />
        {uploading ? (
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Uploading... {progress}%</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-300 font-medium">Drop a file here or click to browse</p>
            <p className="text-slate-500 text-sm mt-1">CSV, XLSX — up to 50MB</p>
          </>
        )}
      </div>
    </div>
  )
}
