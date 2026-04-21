import { configureStore } from '@reduxjs/toolkit';

import { reduxExampleReducer } from './exampleSlice';

export const reduxStore = configureStore({
  reducer: {
    reduxExample: reduxExampleReducer
  }
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
