import {
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    OPENLIVE_TOKEN_KEY,
    OPENLIVE_REFRESH_TOKEN_KEY,
    PERMISSION_DATA_KEY
  } from "./StorageKeys";
  
  export const LANGUAGE_KEY = 'Accept-Language';
  export const LANGUAGE_CODE = 'language';
  
  export const storeItem = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, data);
    }
  }
  
  export const removeItem = (key: string) => {
    localStorage.removeItem(key);
  }
  
  export const getItem = (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }
  
  export const getLocalRefreshToken = () => {
    const refreshToken = getItem(REFRESH_TOKEN_KEY);
    return refreshToken;
  }
  
  export const getLocalAccessToken = () => {
    const accessToken = getItem(TOKEN_KEY);
    return accessToken;
  }
  
  export const updateLocalAccessToken = (token: any) => {
    const accessToken = token;
    localStorage.setItem(TOKEN_KEY, accessToken);
  }
  
  export const updateLocalRefreshToken = (token: any) => {
    const accessToken = token;
    localStorage.setItem(REFRESH_TOKEN_KEY, accessToken);
  }
  
  export const getAccessToken = () => {
    const token = getItem(TOKEN_KEY);
    return token;
  }
  
  export const getRefreshToken = () => {
    const refreshToken = getItem(REFRESH_TOKEN_KEY);
    return refreshToken;
  }
  
  export const setAccessToken = (token: any) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  }
  
  export const setRefreshToken = (token: any) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
  
  export const removeAccessToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(OPENLIVE_TOKEN_KEY);
    localStorage.removeItem(PERMISSION_DATA_KEY);
  }
  
  export const removeRefreshToken = () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(OPENLIVE_REFRESH_TOKEN_KEY);
    localStorage.removeItem(PERMISSION_DATA_KEY);
  }
  
  export const storeSessionItem = (key: string, data: any) => {
    sessionStorage.setItem(key, data);
  }
  
  export const removeSessionItem = (key: string) => {
    sessionStorage.removeItem(key);
  }
  
  export const getSessionItem = (key: string) => {
    return sessionStorage.getItem(key);
  }