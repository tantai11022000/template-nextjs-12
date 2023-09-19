import { SUB_URL } from '../index';

export const handleResponse = async (response: any) => {
  return Promise.resolve(response.data);
}

export const handleUnauthorizedError = (error: any) => {
  if (error && error.response && error.response.data) {
    
  }
}


export const redirectToLogin = () => {
    const subUrl = SUB_URL ? SUB_URL : "";
    const loginUrl = window.location.origin + subUrl + '/login';
    window.location.href = loginUrl
}