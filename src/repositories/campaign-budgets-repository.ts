import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';


export const getCampaignBudgets = (id: any) => {
    return userClient.get(`/campaign-amazon/get-all-campaigns-of-account/${id}`);
}
