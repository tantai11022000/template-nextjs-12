import * as commonsRepository from '../repositories/commons-repository';
import { handleResponse } from '../config/api/apiResponse'

export const getDaily30MinsSlot = async () => {
    try {
        const response = await commonsRepository.getDaily30MinsSlot();
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getPortfolio = async (id: any) => {
    try {
        const response = await commonsRepository.getPortfolio(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getCampaignStatus = async () => {
    try {
        const response = await commonsRepository.getCampaignStatus();
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}