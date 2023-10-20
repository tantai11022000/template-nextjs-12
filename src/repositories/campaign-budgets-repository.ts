import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';


export const getCampaignBudgets = (id: any) => {
    return guestClient.get(`/campaign-amazon/getAllCampaignsOfAccount/${id}`);
}
