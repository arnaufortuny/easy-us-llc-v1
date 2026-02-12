import { Component, type ReactNode } from "react";
import { AlertCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PanelErrorBoundaryProps {
  children: ReactNode;
  panelName?: string;
}

interface PanelErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class PanelErrorBoundary extends Component<PanelErrorBoundaryProps, PanelErrorBoundaryState> {
  constructor(props: PanelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): PanelErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Card className="rounded-2xl shadow-sm p-6 md:p-8 text-center" data-testid={`error-boundary-${this.props.panelName || 'panel'}`}>
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <div>
              <h3 className="text-base font-black text-foreground mb-1">
                {this.props.panelName ? `Error in ${this.props.panelName}` : 'Something went wrong'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred in this section.'}
              </p>
            </div>
            <Button
              onClick={this.handleRetry}
              variant="outline"
              size="sm"
              className="rounded-full font-bold mt-2"
              data-testid="button-panel-error-retry"
            >
              Retry
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
