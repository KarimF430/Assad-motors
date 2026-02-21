/**
 * Global Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the component tree,
 * logs them to Sentry, and displays a fallback UI.
 */

'use client'

import { Component, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo)
        }

        // Log to Sentry in production (if available)
        if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, {
                contexts: {
                    react: {
                        componentStack: errorInfo.componentStack,
                    },
                },
            })
        }
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-4">
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
