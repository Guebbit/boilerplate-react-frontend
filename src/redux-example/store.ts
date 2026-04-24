import { configureStore } from '@reduxjs/toolkit';

import { exampleCounterReducer } from '@/redux-example/counterSlice';

/**
 * Example Redux store.
 * It is not wired into the runtime app on purpose: this is a learning artifact.
 */
export const exampleReduxStore = configureStore({
    reducer: {
        exampleCounter: exampleCounterReducer
    }
});

export type IExampleRootState = ReturnType<typeof exampleReduxStore.getState>;
export type IExampleDispatch = typeof exampleReduxStore.dispatch;
