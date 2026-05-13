type TCustomSlice = {
  id: string;
};

export const CUSTOM_SLICE_NAME = "custom";
export const FILTER_EMPLOYEE = `${CUSTOM_SLICE_NAME}/filterEmployee`;

export const initialState: TCustomSlice = {
  id: "",
};

export type FilterEmployeeAction = {
  type: typeof FILTER_EMPLOYEE;
  payload: string;
};

export const filterEmployee = (payload: string): FilterEmployeeAction => ({
  type: FILTER_EMPLOYEE,
  payload,
});

const customReducer = (state: TCustomSlice = initialState): TCustomSlice =>
  state;

export default customReducer;
