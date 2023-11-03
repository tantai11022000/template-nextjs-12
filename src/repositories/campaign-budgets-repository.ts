import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const campaignAmazonUrl = '/campaign-amazon'


export const getCampaignBudgets = (partnerAccountId: any, params: any) => {
    return userClient.get(`${campaignAmazonUrl}/${partnerAccountId}`,  { params });
}
