export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-900/30 border border-red-500/40 text-red-300 rounded-lg px-4 py-3 text-sm">
      {message}
    </div>
  )
}
