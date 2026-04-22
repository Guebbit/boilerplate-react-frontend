import { useMemo, useState } from 'react';

import { AppProvidedVariableContext } from './context/AppContext';
import { AppRouter } from './router';

function App() {
  const [providedVariable, setProvidedVariable] = useState('From App.tsx');

  const providedValue = useMemo(
    () => ({ providedVariable, setProvidedVariable }),
    [providedVariable]
  );

  return (
    <AppProvidedVariableContext.Provider value={providedValue}>
      <AppRouter />
    </AppProvidedVariableContext.Provider>
  );
}

export default App;
