import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ReduxExampleState {
  value: number;
}

const initialState: ReduxExampleState = {
  value: 0
};

const reduxExampleSlice = createSlice({
  name: 'reduxExample',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    incrementBy: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const { increment, incrementBy } = reduxExampleSlice.actions;
export const reduxExampleReducer = reduxExampleSlice.reducer;
