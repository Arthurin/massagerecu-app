"use client";

import React from "react";

type State = {
  hasError: boolean;
  error?: Error;
};

export class GlobalErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Ici tu peux logger vers un service (Sentry, LogRocket, console serveur…)
    console.error(
      "Erreur capturée par GlobalErrorBoundary :",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Une erreur est survenue
          </h1>
          <p className="text-gray-700 mb-6">
            Désolé, quelque chose s’est mal passé. Veuillez réessayer plus tard.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
