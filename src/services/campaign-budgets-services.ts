import * as campaignBudgetsRepository from '../repositories/campaign-budgets-repository';
import { handleResponse } from '../config/api/apiResponse'

export const getCampaignBudgets = async (id: any) => {
    try {
        const response = await campaignBudgetsRepository.getCampaignBudgets(id);
        return handleResponse(response);

    } catch (error) {
        return Promise.reject(error);
    }
}