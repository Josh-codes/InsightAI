import { useState } from 'react'
import Navbar from '../components/Common/Navbar'
import UploadCard from '../components/Dataset/UploadCard'
import DatasetCard from '../components/Dataset/DatasetCard'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import { useDatasets } from '../hooks/useDatasets'

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false)
  const { data: datasets, isLoading } = useDatasets()

  return (
    <div className="min-h-screen bg-landing-bg font-inter text-warm-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-warm-white">Your Datasets</h2>
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 text-sm"
          >
            {showUpload ? 'Cancel' : '+ Upload Dataset'}
          </button>
        </div>

        {showUpload && (
          <div className="mb-6">
            <UploadCard />
          </div>
        )}

        {isLoading && <LoadingSpinner message="Loading datasets..." />}

        {!isLoading && datasets?.length === 0 && (
          <div className="text-center py-16 text-warm-muted">
            <p className="text-lg mb-2">No datasets yet</p>
            <p className="text-sm">Upload a CSV or Excel file to get started.</p>
          </div>
        )}

        <div className="space-y-3">
          {datasets?.map((ds: { id: number; name: string; row_count: number; file_size_bytes: number; created_at: string }) => <DatasetCard key={ds.id} dataset={ds} />)}
        </div>
      </main>
    </div>
  )
}
