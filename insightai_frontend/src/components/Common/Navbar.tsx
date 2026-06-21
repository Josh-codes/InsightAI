import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-landing-card border-b border-warm-border px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-warm-white hover:text-accent transition-colors">
        InsightAI
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-warm-muted">{user.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-warm-muted hover:text-warm-white transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
