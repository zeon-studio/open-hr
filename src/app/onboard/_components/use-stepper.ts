import { useContext } from "react";
import { StepperContext } from "./stepper-provider";

export function useStepper() {
  const context = useContext(StepperContext);

  if (context === undefined) {
    throw new Error("useStepper must be used within a StepperProvider");
  }
  return context;
}
