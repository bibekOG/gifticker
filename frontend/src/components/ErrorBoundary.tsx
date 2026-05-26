import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="text-center max-w-md px-8">
              <h1 className="font-serif text-headline-xl text-on-surface mb-4">Something went wrong</h1>
              <p className="font-sans text-body-lg text-on-surface-variant mb-8">
                {this.state.error?.message || "An unexpected error occurred."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-6 py-3 rounded-lg font-sans text-body-md font-bold"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
