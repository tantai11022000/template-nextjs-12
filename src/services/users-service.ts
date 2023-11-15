import * as usersRepository from '../repositories/users-repository';
import { handleResponse } from '../config/api/apiResponse'

export const getUsersSystem = async () => {
    try {
        const response = await usersRepository.getUsersSystem();
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}
