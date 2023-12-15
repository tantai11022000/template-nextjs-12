import * as accountsRepository from '../repositories/accounts-repository';
import { handleResponse } from '../config/api/apiResponse'

export const createPartnerAccount = async (body: any) => {
    try {
        const response = await accountsRepository.createPartnerAccount(body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const checkValidAccount = async (body: any) => {
    try {
        const response = await accountsRepository.checkValidAccount(body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const editPartnerAccount = async (id: any, body: any) => {
    try {
        const response = await accountsRepository.editPartnerAccount(id, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getAllPartnerAccounts = async (params: any) => {
    try {
        const response = await accountsRepository.getAllPartnerAccounts(params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getAccountInfo = async (id: any) => {
    try {
        const response = await accountsRepository.getAccountInfo(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateAccountStatus = async (id: any, body: any) => {
    try {
        const response = await accountsRepository.updateAccountStatus(id, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteAccountById = async (id: any) => {
    try {
        const response = await accountsRepository.deleteAccountById(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}