import * as weightTemplateRepository from '../repositories/weight-template-repository';
import { handleResponse } from '../config/api/apiResponse'

export const getAllWeightTemplates = async (params: any) => {
    try {
        const response = await weightTemplateRepository.getAllWeightTemplates(params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getWeightTemplateDetail = async (id: any) => {
    try {
        const response = await weightTemplateRepository.getWeightTemplateDetail(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const createWeightTemplate = async (body: any) => {
    try {
        const response = await weightTemplateRepository.createWeightTemplate(body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const editWeightTemplate = async (id: any, body: any) => {
    try {
        const response = await weightTemplateRepository.editWeightTemplate(id, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteWeightTemplate = async (id: any) => {
    try {
        const response = await weightTemplateRepository.deleteWeightTemplate(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}