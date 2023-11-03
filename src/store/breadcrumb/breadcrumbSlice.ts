import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IBreadcrumb {
  data: {label: string | number, url: string}[]
}

const initialState: IBreadcrumb = {
  data : []
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

export default slice.reducer;

export const getBreadcrumb = (state: any) => state.breadcrumb ? state.breadcrumb.data : null;
