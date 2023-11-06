import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IGlobal {
  currentMenu: string,
  collapseMenu: boolean
  status: string,
  error: string
}

const initialState: IGlobal = {
  currentMenu: "",
  collapseMenu: true,
  status: "idle",
  error: ""
}

const slice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setCurrentMenu: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.currentMenu = data ? data : "";
    },
    setCollapseMenu: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.collapseMenu = data ? data : false;
    },
  },
});

export const { setCurrentMenu, setCollapseMenu } = slice.actions

export const getCurrentMenu = (state: any) => state.globals ? state.globals.currentMenu : null;
export const getCollapseMenu = (state: any) => state.globals ? state.globals.collapseMenu : null;

export default slice.reducer;