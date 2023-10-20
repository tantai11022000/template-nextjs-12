import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const accountUrl = 'account'

export const createPartnerAccount = (body: any) => {
    return guestClient.post(`${accountUrl}/createAccount`, body);
}

export const checkValidAccount = (body: any) => {
    return guestClient.post(`${accountUrl}/checkValidAccount`, body);
}

export const editPartnerAccount = (id: any, body: any) => {
    return guestClient.put(`${accountUrl}/updateAccountById/${id}`, body);
}

export const getAllPartnerAccounts = () => {
    return guestClient.get(`${accountUrl}/getAllAccounts`);
}

export const getAccountInfo = (id: any) => {
    return guestClient.get(`${accountUrl}/getAccountById/${id}`);
}
