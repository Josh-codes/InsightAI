import { Component, ErrorInfo, ReactNode } from 'react'

interface State { hasError: boolean }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Chart render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-warm-muted text-sm text-center py-8">
          Could not render chart. View the table below instead.
        </div>
      )
    }
    return this.props.children
  }
}
