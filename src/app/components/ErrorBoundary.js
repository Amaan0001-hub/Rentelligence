"use client";
import React from 'react';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Something went wrong on our end
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                We&apos;re experiencing an unexpected issue. Our team has been notified and is working to fix it.
                Please try again in a few minutes.
                <br />
                If the problem continues, contact us at{" "}
                <a
                  href="mailto:support@rentelligence.ai"
                  className="text-blue-600 hover:underline"
                >
                  support@rentelligence.ai
                </a>{" "}
                with details of what you were doing when the error occurred.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Thank you for your patience.
              </p>

              <div className="mt-4">
                <a href="/pages/dashboard">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Go to dashboard
                  </button>
                </a>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                    Error Details (Development)
                  </summary>
                  <pre className="p-2 mt-2 overflow-auto text-xs text-red-600 rounded bg-red-50 max-h-40">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 