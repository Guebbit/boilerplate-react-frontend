import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Example Redux slice to study state, actions and reducers.
 * This file is intentionally verbose and documented.
 */
export type IReduxCounterState = {
    value: number;
    lastUpdateReason: string;
};

const initialState: IReduxCounterState = {
    value: 0,
    lastUpdateReason: 'initial'
};

const counterSlice = createSlice({
    name: 'exampleCounter',
    initialState,
    reducers: {
        increment(state) {
            state.value += 1;
            state.lastUpdateReason = 'increment';
        },
        decrement(state) {
            state.value -= 1;
            state.lastUpdateReason = 'decrement';
        },
        addByAmount(state, action: PayloadAction<number>) {
            state.value += action.payload;
            state.lastUpdateReason = 'addByAmount';
        },
        reset(state) {
            state.value = 0;
            state.lastUpdateReason = 'reset';
        }
    }
});

export const { increment, decrement, addByAmount, reset } = counterSlice.actions;
export const exampleCounterReducer = counterSlice.reducer;
