import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const campaignAmazonUrl = '/campaign-amazon'

export const getCampaignBudgets = (partnerAccountId: any, params: any) => {
    return userClient.get(`/campaigns/partner-account/${partnerAccountId}`, { params });
}
export const getCampaignPerformanceHistoryLog = (id: any, params: any) => {
    return userClient.get(`/amazon-campaign-30m/${id}`, { params });
}

