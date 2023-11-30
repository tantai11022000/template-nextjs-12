import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';


export const getSyncData = (id: any) => {
    return userClient.post(`account/syncs/${id}`);
}

