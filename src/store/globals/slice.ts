import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IGlobal {
  currentMenu: string,
  status: string,
  error: string
}

const initialState: IGlobal = {
  currentMenu: "",
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
  },
});

export const { setCurrentMenu } = slice.actions

export const getCurrentMenu = (state: any) => state.globals ? state.globals.currentMenu : null;

export default slice.reducer;