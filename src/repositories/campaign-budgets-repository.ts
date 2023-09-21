import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';


export const getCampaignBudgets = (params: any) => {
    return guestClient.get(`/users?page=${params}`);
}
