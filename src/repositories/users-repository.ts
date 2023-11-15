import userClient from '../config/api/userClient';
import guestClient from '../config/api/guestClient';

const userUrl = 'users'

export const getUsersSystem = () => {
    return userClient.get(`${userUrl}`);
}
