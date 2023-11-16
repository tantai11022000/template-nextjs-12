import axios from 'axios';
import config from '../index';
import {
    getItem,
} from '../../utils/StorageUtils';
import { TOKEN_KEY } from '../../utils/StorageKeys';

const userClient = axios.create({
    baseURL: config.api.host || "",
    headers: {
        Accept: 'application/json'
    }
});

userClient.interceptors.request.use(
    async (request: any) => {
        const token:any = await getItem(TOKEN_KEY);
        const obj = token ? JSON.parse(token) : ""
        const accessToken = obj && obj.accessToken ? obj.accessToken : null
        
        if (!accessToken) {
          window.location.href = `${process.env.NEXT_PUBLIC_MAIN_URL}/#/user/login`
          return Promise.reject("Not authorizaton");
        }

        if (request && request.headers) {
            request.headers['Authorization'] = 'Bearer ' + accessToken;
        }
        return request;
    },
    error => Promise.reject(error)
);

userClient.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
        const originalConfig = error.config;
        // Access Token was expired
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          return userClient(originalConfig);
        }

        if (error.response.status === 403) {
          window.location.href = `${process.env.NEXT_PUBLIC_MAIN_URL}/#/user/login`
          return Promise.reject("Forbidden");
        }

        return Promise.reject(error.response && error.response.data ? error.response.data : error);
    }
);
export default userClient;