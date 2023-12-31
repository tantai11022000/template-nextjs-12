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

export const uploadBudgetScheduleCSVFile2 = (id: any, body: any) => {
    return userClient.post(`${campaignsUrl}/upload/schedule-step-2/${id}`, body, {headers: {'Content-Type': 'multipart/form-data'}});
}

export const uploadStatusScheduleCSVFile = (id: any, body: any) => {
    return userClient.post(`${campaignsUrl}/upload/status-schedule-step-1/${id}`, body, {headers: {'Content-Type': 'multipart/form-data'}});
}

export const uploadStatusScheduleCSVFile2 = (id: any, body: any) => {
    return userClient.post(`${campaignsUrl}/upload/status-schedule-step-2/${id}`, body, {headers: {'Content-Type': 'multipart/form-data'}});
}

export const setScheduleBudgetForCampaigns = (body: any) => {
    return userClient.put(`${campaignsUrl}/by-schedule`, body);
}

export const getScheduleLog = (paths: any, params: any, type: any) => {
    return userClient.get(`${campaignsUrl}/${type}-schedule-log/${paths.campaignId}/${paths.partnerAccountId}`, { params });
}

export const getScheduleBudgetLog = (paths: any, params: any) => {
    return userClient.get(`${campaignsUrl}/budget-schedule-log/${paths.campaignId}/${paths.partnerAccountId}`, { params });
}

export const getScheduleStatusLog = (paths: any, params: any) => {
    return userClient.get(`${campaignsUrl}/status-schedule-log/${paths.campaignId}/${paths.partnerAccountId}`, { params });
}

export const changeBudgetCampaign = (body: any) => {
    return userClient.put(`${campaignsUrl}/update-budget`, body);
}

export const changeStatusCampaign = (body: any) => {
    return userClient.put(`${campaignsUrl}/update-status`, body);
}

export const deleteBudgetScheduleById = (params: any) => {
    return userClient.delete(`${campaignsUrl}/budget-schedule/${params.partnerAccountId}/${params.scheduleId}`);
}

export const deleteStatusScheduleById = (params: any) => {
    return userClient.delete(`${campaignsUrl}/status-schedule/${params.partnerAccountId}/${params.scheduleId}`);
}

export const getScheduleById = (id: any) => {
    return userClient.get(`${campaignsUrl}/getSettingBudgetById/${id}`);
}

export const exportCampaignsCSVFile = (params: any, body: any) => {
    return userClient.post(`${campaignsUrl}/exportCSV/schedule`, body, {
        params, responseType: 'arraybuffer', headers: {
            'Content-Disposition': 'attachment; filename="example.csv"'
        }
    });
}

export const downloadCSVTemplateSchedule = () => {
    return userClient.get(`${campaignsUrl}/download/template-schedule`, {
         responseType: 'arraybuffer', headers: {
            'Content-Disposition': 'attachment; filename="example.csv"'
        }
    });
}

export const downloadCSVTemplateStatus = () => {
    return userClient.get(`${campaignsUrl}/download/template-status`, {
        responseType: 'arraybuffer', headers: {
           'Content-Disposition': 'attachment; filename="example.csv"'
        }
    });
}
