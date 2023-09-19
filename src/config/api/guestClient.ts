import axios from 'axios';
import { API_HOST } from '../index';

const guestClient = axios.create({
  baseURL: API_HOST,
  timeout: 30000
});

guestClient.interceptors.request.use(
  request => {
    return request;
  },
  error => Promise.reject(error)
);

guestClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error && error.response) {
      return Promise.reject(error.response.data);
    } else {
      return Promise.reject(error);
    }
  }
);

export default guestClient;