import React, { createContext, useState } from "react";
import { steppers } from "./steppers";

type StepperContextType = {
  steppers: typeof steppers;
  currentStep: number;
  completedSteps: number[];
  handleStepChange: (stepIndex?: number | number[]) => void;
};

const StepperContext = createContext<StepperContextType>({
  steppers,
  currentStep: steppers[0].id,
  completedSteps: [],
  handleStepChange: () => {},
});

const StepperProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(steppers[0].id);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepChange = (stepId?: number | number[]) => {
    if (Array.isArray(stepId)) {
      setCurrentStep(Math.max(...stepId) + 1);
      setCompletedSteps([...new Set([...completedSteps, ...stepId])]);
      return;
    }
    const nextStep = stepId ?? currentStep + 1;
    setCurrentStep(nextStep);
    setCompletedSteps([...new Set([...completedSteps, nextStep])]);
  };

  const contextValue: StepperContextType = {
    steppers,
    currentStep,
    completedSteps,
    handleStepChange,
  };

  return (
    <StepperContext.Provider value={contextValue}>
      {children}
    </StepperContext.Provider>
  );
};

// HOC Wrapper
const withStepperProvider = (Component: React.ComponentType) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => (
    <StepperProvider>
      <Component {...props} />
    </StepperProvider>
  );
};

export { StepperContext, StepperProvider, withStepperProvider };
