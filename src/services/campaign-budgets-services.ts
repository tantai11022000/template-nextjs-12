import * as campaignBudgetsRepository from '../repositories/campaign-budgets-repository';
import { handleResponse } from '../config/api/apiResponse'

export const getCampaignBudgets = async (partnerAccountId: any, params: any) => {
    try {
        const response = await campaignBudgetsRepository.getCampaignBudgets(partnerAccountId, params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getCampaignPerformanceHistoryLog = async (id: any, params: any) => {
    try {
        const response = await campaignBudgetsRepository.getCampaignPerformanceHistoryLog(id, params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const uploadBudgetScheduleCSVFile = async (id: any, body: any) => {
    try {
        const response = await campaignBudgetsRepository.uploadBudgetScheduleCSVFile(id, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const uploadBudgetScheduleCSVFile2 = async (id: any, body: any) => {
    try {
        const response = await campaignBudgetsRepository.uploadBudgetScheduleCSVFile2(id, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const uploadStatusScheduleCSVFile = async (id: any, body: any) => {
    try {
        const response = await campaignBudgetsRepository.uploadStatusScheduleCSVFile(id, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const uploadStatusScheduleCSVFile2 = async (id: any, body: any) => {
    try {
        const response = await campaignBudgetsRepository.uploadStatusScheduleCSVFile2(id, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const setScheduleBudgetForCampaigns = async (body: any) => {
    try {
        const response = await campaignBudgetsRepository.setScheduleBudgetForCampaigns(body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getScheduleLog = async (paths: any, params: any, type: any) => {
    try {
        const response = await campaignBudgetsRepository.getScheduleLog(paths, params, type);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getScheduleBudgetLog = async (paths: any, params: any) => {
    try {
        const response = await campaignBudgetsRepository.getScheduleBudgetLog(paths, params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getScheduleStatusLog = async (paths: any, params: any) => {
    try {
        const response = await campaignBudgetsRepository.getScheduleStatusLog(paths, params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const changeBudgetCampaign = async (body: any) => {
    try {
        const response = await campaignBudgetsRepository.changeBudgetCampaign(body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteScheduleById = async (params: any) => {
    try {
        const response = await campaignBudgetsRepository.deleteScheduleById(params);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const getScheduleById = async (id: any) => {
    try {
        const response = await campaignBudgetsRepository.getScheduleById(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const exportCampaignsCSVFile = async (params: any, body: any) => {
    try {
        const response = await campaignBudgetsRepository.exportCampaignsCSVFile(params, body);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const downloadCSVTemplateSchedule = async () => {
    try {
        const response = await campaignBudgetsRepository.downloadCSVTemplateSchedule();
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}

export const downloadCSVTemplateStatus = async () => {
    try {
        const response = await campaignBudgetsRepository.downloadCSVTemplateStatus();
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}