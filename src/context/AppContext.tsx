import { createContext, useContext } from 'react';

export interface AppProvidedVariableContextShape {
  providedVariable: string;
  setProvidedVariable: (value: string) => void;
}

export const AppProvidedVariableContext = createContext<AppProvidedVariableContextShape>({
  providedVariable: 'Not provided',
  setProvidedVariable: () => {
    // no-op default
  }
});

export const useAppProvidedVariable = () => useContext(AppProvidedVariableContext);
