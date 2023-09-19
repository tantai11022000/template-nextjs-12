import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const url = 'template-url'


export const getTemplate = (params: any) => {
    return guestClient.get(`${url}/get`, {params});
}


export const postTemplate = (body: any) => {
    return userClient.post(`${url}/post`, body);
}


export const updateTemplate = (id:number,body: any) => {
    return userClient.put(`${url}/update/${id}`, body);
}