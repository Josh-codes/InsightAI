import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../hooks/useAuth'
import ErrorBanner from '../Common/ErrorBanner'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data
      const msg = data?.message ?? 'Registration failed.'
      const detail = data?.errors ? Object.values(data.errors).flat().join(' ') : ''
      setError(detail || msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner message={error} />}
      <div>
        <label className="block text-sm text-warm-muted mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-landing-bg border border-warm-border rounded-lg px-3 py-2 text-warm-white focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="block text-sm text-warm-muted mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-landing-bg border border-warm-border rounded-lg px-3 py-2 text-warm-white focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="block text-sm text-warm-muted mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-landing-bg border border-warm-border rounded-lg px-3 py-2 text-warm-white focus:outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
      <p className="text-center text-sm text-warm-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
