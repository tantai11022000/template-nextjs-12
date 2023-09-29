import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISelectItem {
  label: string | number,
  value: string | number,
}

interface IGlobalActionItem {
  placeholder?: string,
  options: ISelectItem[],
}

interface IGlobalAction {
  data: IGlobalActionItem[],
  status: string,
  error: string
}

const initialState: IGlobalAction = {
  data: [],
  status: "idle",
  error: ""
}

const globalActionSlice = createSlice({
  name: 'globalActions',
  initialState,
  reducers: {
    setGlobalActions: (
      state,
      { payload: { data } }: PayloadAction<{ data: IGlobalActionItem[] }>
    ) => {
      state.data = data;
    },
  },
});

export const { setGlobalActions } = globalActionSlice.actions

//Fetch User Report
export const getGlobalAction = (state: any) => state.globalActions ? state.globalActions.data : null;

export default globalActionSlice.reducer;