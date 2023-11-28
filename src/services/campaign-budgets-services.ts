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