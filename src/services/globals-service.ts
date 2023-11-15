import * as globalsRepository from '../repositories/globals-repository';
import { handleResponse } from '../config/api/apiResponse'

export const getSyncData = async (id: any) => {
    try {
        const response = await globalsRepository.getSyncData(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}