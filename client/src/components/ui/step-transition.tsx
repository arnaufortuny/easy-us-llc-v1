import { ReactNode } from "react";

interface StepTransitionProps {
  step: number;
  children: ReactNode;
  direction?: "forward" | "backward";
}

export function StepTransition({ children }: StepTransitionProps) {
  return <div>{children}</div>;
}
