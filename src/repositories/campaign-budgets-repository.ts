import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const campaignAmazonUrl = '/campaign-amazon';
const campaignsUrl = '/campaigns';


export const getCampaignBudgets = (partnerAccountId: any, params: any) => {
    return userClient.get(`${campaignsUrl}/partner-account/${partnerAccountId}`, { params });
}

export const getCampaignPerformanceHistoryLog = (id: any, params: any) => {
    return userClient.get(`/amazon-campaign-30m/${id}`, { params });
}

export const uploadBudgetScheduleCSVFile = (id: any, body: any) => {
    return userClient.post(`${campaignsUrl}/upload/schedule-step-1/${id}`, body, {headers: {'Content-Type': 'multipart/form-data'}});
}

export const setScheduleBudgetForCampaigns = (body: any) => {
    return userClient.put(`${campaignsUrl}/by-schedule`, body);
}

export const getScheduleBudgetLog = (paths: any, params: any) => {
    return userClient.get(`${campaignsUrl}/budget-schedule-log/${paths.campaignId}/${paths.partnerAccountId}`, { params });
}

export const changeBudgetCampaign = (body: any) => {
    return userClient.put(`${campaignsUrl}/update-budget`, body);
}
