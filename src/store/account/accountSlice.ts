import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';

interface IAccount {
  id: number | string,
  name: string,
  description: string,
  supervisors: number[],
  setting: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
  };
}

interface IAccountList {
  accounts: IAccount[],
  currentAccount: string,
  isSyncData: boolean,
  status: string,
  error: string
}

const initialState: IAccountList = {
  accounts: [],
  currentAccount: "",
  isSyncData: false, 
  status: "idle",
  error: ""
}

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountList: (
      state,
      { payload: { data } }: PayloadAction<{ data: IAccount[] }>
    ) => {
      state.accounts = data.filter((account: any) => account.status == 1);
    },

    setCurrentAccount: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.currentAccount = data ? data : "";
    },

    addAccount: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.accounts.push(data)
    },

    editAccount: (
      state,
      { payload: { id, value } }: PayloadAction<{ id: any, value: any }>
    ) => {
      const editedAccount = state.accounts.find((account: any) => account.id == id);
      if (editedAccount) {
        editedAccount.name = value.name;
        editedAccount.description = value.description;
        editedAccount.supervisors = value.supervisors;
        editedAccount.setting.client_id = value.setting.client_id;
        editedAccount.setting.client_secret = value.setting.client_secret;
        editedAccount.setting.refresh_token = value.setting.refresh_token;

      }
    },

    setSyncData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.isSyncData = data ? data : false;
    },
  },
});

export const { setAccountList, setCurrentAccount, addAccount, editAccount, setSyncData } = slice.actions

//Fetch User Report
export const getAccountList = (state: any) => state.account ? state.account.accounts : null;
export const getCurrentAccount = (state: any) => state.account ? state.account.currentAccount : null;
export const getIsSyncData = (state: any) => state.account ? state.account.isSyncData : null;

export default slice.reducer;