import LoginForm from '../components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-landing-bg font-inter flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-warm-white text-center mb-2">InsightAI</h1>
        <p className="text-warm-muted text-center mb-8">Sign in to your account</p>
        <div className="bg-landing-card border border-warm-border rounded-2xl p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
