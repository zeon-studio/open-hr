export type Filter = {
  page: number;
  limit: number;
  search: string | number | boolean;
};

export const FILTER_SLICE_NAME = "filter";
export const UPDATE_PAGE = `${FILTER_SLICE_NAME}/updatePage`;
export const SEARCH_FILTER = `${FILTER_SLICE_NAME}/search`;

export const initialState: Filter = {
  page: 1,
  limit: 100,
  search: "",
};

export type UpdatePageAction = {
  type: typeof UPDATE_PAGE;
  payload: number;
};

export type SearchFilterAction = {
  type: typeof SEARCH_FILTER;
  payload: string | number | boolean;
};

export const updatePage = (payload: number): UpdatePageAction => ({
  type: UPDATE_PAGE,
  payload,
});

export const search = (
  payload: string | number | boolean,
): SearchFilterAction => ({
  type: SEARCH_FILTER,
  payload,
});

const filterReducer = (state: Filter = initialState): Filter => state;

export default filterReducer;
