import RegisterForm from '../components/Auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-landing-bg font-inter flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-warm-white text-center mb-2">InsightAI</h1>
        <p className="text-warm-muted text-center mb-8">Create your account</p>
        <div className="bg-landing-card border border-warm-border rounded-2xl p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
