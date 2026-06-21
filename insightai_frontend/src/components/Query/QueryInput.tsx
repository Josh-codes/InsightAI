import { useState, FormEvent } from 'react'

interface Props {
  onSubmit: (question: string) => void
  isLoading: boolean
}

export default function QueryInput({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Ask a question, e.g. "Which products generated the most revenue?"'
        disabled={isLoading}
        className="flex-1 bg-surface border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
      >
        {isLoading ? 'Analyzing...' : 'Ask'}
      </button>
    </form>
  )
}
