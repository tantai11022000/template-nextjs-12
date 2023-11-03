import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IBreadcrumb {
  data: {label: string | number, url: string}[],
  status: string,
  error: string
}

const initialState: IBreadcrumb = {
  data : [],
  status: "idle",
  error: ""
}

const slice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumb: (state,
        { payload: { data } }: PayloadAction<{ data: any }>
      ) => {
        state.data = data;
      },
  }
})

export const { setBreadcrumb } = slice.actions

export const getBreadcrumb = (state: any) => state.breadcrumb ? state.breadcrumb.data : null;


export default slice.reducer;

