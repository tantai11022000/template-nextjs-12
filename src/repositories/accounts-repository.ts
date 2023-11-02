import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const accountUrl = 'account'

export const createPartnerAccount = (body: any) => {
    return userClient.post(`${accountUrl}`, body);
}

export const checkValidAccount = (body: any) => {
    return userClient.post(`${accountUrl}/check-valid-account`, body);
}

export const editPartnerAccount = (id: any, body: any) => {
    return userClient.put(`${accountUrl}/${id}`, body);
}

export const getAllPartnerAccounts = () => {
    return userClient.get(`${accountUrl}/all-accounts`);
}

export const getAccountInfo = (id: any) => {
    return userClient.get(`${accountUrl}/${id}`);
}
