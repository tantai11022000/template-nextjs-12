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