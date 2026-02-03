import React from "react";

interface StripeErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class StripeErrorBoundary extends React.Component<
  React.PropsWithChildren,
  StripeErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: unknown): StripeErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }

  override componentDidCatch(error: unknown, errorInfo: React.ErrorInfo): void {
    // Tu peux envoyer ça à Sentry ou à un service de logs
    console.error("Erreur Stripe capturée:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="tw:p-4 tw:bg-red-100 tw:text-red-700 tw:rounded">
          <p>
            Une erreur est survenue avec le service de paiement en ligne.
            Veuillez réessayer plus tard ou me contacter directement.
          </p>
          <pre>{this.state.errorMessage}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
