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