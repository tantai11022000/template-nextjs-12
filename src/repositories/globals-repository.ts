import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';


export const getSyncData = (id: any) => {
    return userClient.get(`account/syncs/${id}`);
}

