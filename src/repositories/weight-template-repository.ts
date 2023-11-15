import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const weightTemplateUrl = 'weight-template'

export const getAllWeightTemplates = (params: any) => {
    return userClient.get(`${weightTemplateUrl}`, { params });
}

export const getWeightTemplateDetail = (id: any) => {
    return userClient.get(`${weightTemplateUrl}/${id}`);
}
export const createWeightTemplate = (body: any) => {
    return userClient.post(`${weightTemplateUrl}`, body );
}

export const editWeightTemplate = (id: any, body: any) => {
    return userClient.put(`${weightTemplateUrl}/${id}`, body );
}

export const deleteWeightTemplate = (id: any) => {
    return userClient.delete(`${weightTemplateUrl}/${id}`);
}
