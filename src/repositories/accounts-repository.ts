import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const accountUrl = 'account'

export const createPartnerAccount = (body: any) => {
    return userClient.post(`${accountUrl}/create-account`, body);
}

export const checkValidAccount = (body: any) => {
    return userClient.post(`${accountUrl}/check-valid-account`, body);
}

export const editPartnerAccount = (id: any, body: any) => {
    return userClient.put(`${accountUrl}/update-account-by-id/${id}`, body);
}

export const getAllPartnerAccounts = (params: any) => {
    return userClient.get(`${accountUrl}/get-all-accounts`, { params });
}

export const getAccountInfo = (id: any) => {
    return userClient.get(`${accountUrl}/get-account-by-id/${id}`);
}
