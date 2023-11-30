import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const commonsUrl = 'commons'

export const getDaily30MinsSlot = () => {
    return userClient.get(`${commonsUrl}/daily-30m-slot`);
}

