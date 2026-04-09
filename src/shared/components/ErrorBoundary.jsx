import { Component } from 'react';

/**
 * ErrorBoundary — Catches unhandled JavaScript errors in child components
 * and renders a Pirates-themed fallback UI instead of a white page crash.
 *
 * Usage:
 *   <ErrorBoundary moduleName="Roster">
 *     <RosterPanel />
 *   </ErrorBoundary>
 *
 * Props:
 *   moduleName  — optional label for which module crashed
 *   onError     — optional callback (error, errorInfo)
 *   fallback    — optional custom fallback component receiving { error, reset }
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    const moduleName = this.props.moduleName || 'Unknown';
    console.error(
      `[ErrorBoundary] Crash in "${moduleName}" module:`,
      error,
      errorInfo,
    );

    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Allow a custom fallback renderer
    if (this.props.fallback) {
      const Fallback = this.props.fallback;
      return <Fallback error={this.state.error} reset={this.handleReset} />;
    }

    const { error, errorInfo, showDetails } = this.state;
    const moduleName = this.props.moduleName;

    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="bg-[#27251F] border border-[#3A3A3A] rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#E74C3C]/15">
            <svg
              className="w-8 h-8 text-[#E74C3C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-[#FDB515] mb-2">
            Something went wrong
          </h2>

          {/* Module info */}
          {moduleName && (
            <p className="text-sm text-[#8E8E8E] mb-1">
              The <span className="text-[#FAF9F6] font-medium">{moduleName}</span> module encountered an error.
            </p>
          )}

          <p className="text-sm text-[#8E8E8E] mb-6">
            An unexpected error occurred. You can try reloading or head back to the home screen.
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-[#FDB515] hover:bg-[#FDCF58] text-[#1B1B1B] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Reload
            </button>
            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#FAF9F6] border border-[#555] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FDB515]/50"
            >
              Go Home
            </button>
          </div>

          {/* Collapsible error details */}
          <div className="mt-4">
            <button
              onClick={() => this.setState((s) => ({ showDetails: !s.showDetails }))}
              className="text-xs text-[#8E8E8E] hover:text-[#FAF9F6] transition-colors duration-150 underline underline-offset-2"
            >
              {showDetails ? 'Hide details' : 'Show error details'}
            </button>

            {showDetails && (
              <div className="mt-3 text-left bg-[#1B1B1B] border border-[#3A3A3A] rounded-lg p-4 max-h-48 overflow-y-auto">
                <p className="text-xs text-[#E74C3C] font-mono break-words mb-2">
                  {error?.toString()}
                </p>
                {errorInfo?.componentStack && (
                  <pre className="text-xs text-[#8E8E8E] font-mono whitespace-pre-wrap break-words">
                    {errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
