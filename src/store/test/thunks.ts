import { getTemplate } from '@/services/template-service';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDataTest = createAsyncThunk("test/getDataTest", async (params: any) => {
    const response = await getTemplate(params);
    return response;
});
