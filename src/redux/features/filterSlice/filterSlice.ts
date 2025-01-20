import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export type Filter = {
  page: number;
  limit: number;
  search: string | number | boolean;
};

const initialState: Filter = {
  page: 1,
  limit: 100,
  search: "",
};

export const filterSlice = createSlice({
  name: "filter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updatePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    search: (state, action: PayloadAction<string | number | boolean>) => {
      state.search = action.payload;
    },
  },
});

export const { updatePage, search } = filterSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export default filterSlice.reducer;
