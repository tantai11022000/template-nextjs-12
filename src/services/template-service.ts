import * as templateRepository from '../repositories/template-repository';
import { handleResponse } from '../config/api/apiResponse'

export const getTemplate = async (params: any) => {
    try {
        const response = await templateRepository.getTemplate(params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}


export const postTemplate = async (body: any) => {
    try {
        const response = await templateRepository.postTemplate(body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}


export const updateTemplate = async (id:number,body: any) => {
    try {
        const response = await templateRepository.updateTemplate(id,body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}