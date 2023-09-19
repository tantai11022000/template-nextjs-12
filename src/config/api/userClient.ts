import axios from 'axios';
import config from '../index';
import {
    getItem,
    getRefreshToken,
    removeAccessToken,
    removeRefreshToken,
    setRefreshToken,
    storeItem,
    updateLocalAccessToken,
    updateLocalRefreshToken
} from '../../utils/StorageUtils';
import {PERMISSION_DATA_KEY, TOKEN_KEY, USER_DATA_KEY} from '../../utils/StorageKeys';
import { handleUnauthorizedError, redirectToLogin } from './apiResponse';

const userClient = axios.create({
    baseURL: config.api.host || "",
    headers: {
        Accept: 'application/json'
    }
});

function getUrl(config: any) {
    if (config.baseURL) {
        return config.url.replace(config.baseURL, '');
    }
    return config.url;
}

userClient.interceptors.request.use(
    async (request: any) => {
        const token = await getItem(TOKEN_KEY);
        if (!token) {
            return Promise.reject("Not authorizaton");
        }

        if (request && request.headers) {
            request.headers['Authorization'] = 'Bearer ' + token;
            // request.headers["x-access-token"] = token; // for Node.js Express back-end
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
    
          if (originalConfig && originalConfig.url && originalConfig.url !== "/auth/signin" && error.response) {
            // Access Token was expired
            if (error.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;
    
              getRefreshTokenAsync()
              return userClient(originalConfig);
            }
          }

        await handleUnauthorizedError(error);
        return Promise.reject(error.response && error.response.data ? error.response.data : error);
    }
);

const getRefreshTokenAsync = async() => {
  try {
    const rs = await userClient.post("/auth/refreshtoken", {
      refreshToken: getRefreshToken(),
    });

    const { token, refreshToken } = rs.data;
    if (token) {
      updateLocalAccessToken(token);
    }
    if (refreshToken) {
      updateLocalRefreshToken(refreshToken);
    }
    await getMe();
  } catch (_error: any) {
    removeAccessToken();
    removeRefreshToken();
    redirectToLogin();
    return Promise.reject(_error);
  }
}
export const getMe = async () => {
    try {
        const rs = await userClient.get("/me");
        storeItem(PERMISSION_DATA_KEY, JSON.stringify(rs.data));
    } catch (_error: any) {

        return Promise.reject(_error);
    }
}
export default userClient;