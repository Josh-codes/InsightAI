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
        className="flex-1 bg-landing-bg border border-warm-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-accent disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 whitespace-nowrap"
      >
        {isLoading ? 'Analyzing...' : 'Ask'}
      </button>
    </form>
  )
}
