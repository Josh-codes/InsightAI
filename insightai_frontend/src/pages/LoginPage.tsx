import LoginForm from '../components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">InsightAI</h1>
        <p className="text-slate-400 text-center mb-8">Sign in to your account</p>
        <div className="bg-card border border-slate-700 rounded-2xl p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
