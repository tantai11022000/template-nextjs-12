import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDataTest } from './thunks';
import { STATUS_LOADING, STATUS_SUCCEEDED, STATUS_FAILED } from '@/Constant/index';

interface ITest {
  data: any,
  status: string,
  error: string
}

const initialState: ITest = {
  data: null,
  status: "idle",
  error: ""
}

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setDataTest: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.data = data;
    },
  },
  extraReducers(builder) {
        builder
            .addCase(fetchDataTest.pending, (state, action) => {
                state.status = STATUS_LOADING
            })
            .addCase(fetchDataTest.fulfilled, (state, action) => {
                state.status = STATUS_SUCCEEDED
                state.data = action.payload;
            })
            .addCase(fetchDataTest.rejected, (state, action) => {
                state.status = STATUS_FAILED
                state.error = action && action.error && action.error.message ? action.error.message : ""
            })
    }
});

export const { setDataTest } = testSlice.actions

//Fetch User Report
export const getDataTest = (state: any) => state.brands ? state.brands.data : null;

export default testSlice.reducer;