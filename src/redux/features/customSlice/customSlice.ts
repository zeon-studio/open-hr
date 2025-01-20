import { createSlice } from "@reduxjs/toolkit";

type TCustomSlice = {
  id: string;
};

const initialState: TCustomSlice = {
  id: "",
};

export const customSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    filterEmployee: (state, action) => {
      state.id = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { filterEmployee } = customSlice.actions;

export default customSlice.reducer;
