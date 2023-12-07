import qs from 'query-string';
import { toast } from 'react-toastify';

export const getStoredLanguage = () => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('language') || 'en';
    return storedLanguage;
  }
  return 'en';
};

import { NOTIFICATION_DARK, NOTIFICATION_ERROR, NOTIFICATION_INFO, NOTIFICATION_SUCCESS, NOTIFICATION_WARN } from './Constants';
export function cleanObject(obj:any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === '' || obj[key] === null) {
        delete obj[key];
      }
    });
    return obj;
  }
  

export function objectToQueryString(obj:any) {
    const queryString = new URLSearchParams(cleanObject(obj)).toString();
    return queryString;
  }
  

export const changeNextPageUrl = (router:any, current:any) => {
    let query = qs.parse(window.location.search);
    router.push(
      '?' +
        objectToQueryString({
          ...query,
          page: current
        })
    );
    return router;
};


export const updateUrlQuery = async(router:any, params: any) => {
    cleanObject(params)
    const currentParams = new URLSearchParams(router.asPath.split('?')[1]);
    Object.keys(params).forEach((key:string) => {
        currentParams.set(key,params[key])
    })
    const newURL = `${router.pathname}?${currentParams.toString()}`;
    await router.push(newURL, undefined, { shallow: true });
}

export const notificationSimple = (messages: any, level: string, position?: string) => {
  const positionNotification = position ? position : "top-right";
  const configDefault: any = {
    position: positionNotification,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  if (typeof messages == 'string') {
    switch (level) {
      case NOTIFICATION_SUCCESS:
        return toast.success(messages, configDefault);
      case NOTIFICATION_WARN:
        return toast.warn(messages, configDefault);
      case NOTIFICATION_INFO:
        return toast.info(messages, configDefault);
      case NOTIFICATION_ERROR:
        return toast.error(messages, configDefault);
      case NOTIFICATION_DARK:
        return toast.dark(messages, configDefault);
      default:
        return toast(messages, configDefault);
    }
  }

  if (Array.isArray(messages)) {
    messages.forEach((error: string) => {
      switch (level) {
        case NOTIFICATION_SUCCESS:
          return toast.success(error, configDefault);
        case NOTIFICATION_WARN:
          return toast.warn(error, configDefault);
        case NOTIFICATION_INFO:
          return toast.info(error, configDefault);
        case NOTIFICATION_ERROR:
          return toast.error(error, configDefault);
        case NOTIFICATION_DARK:
          return toast.dark(error, configDefault);
        default:
          return toast(error, configDefault);
      }
    });
  }

  // switch (level) {
  //   case NOTIFICATION_SUCCESS:
  //     return toast.success(message, configDefault);
  //   case NOTIFICATION_WARN:
  //     return toast.warn(message, configDefault);
  //   case NOTIFICATION_INFO:
  //     return toast.info(message, configDefault);
  //   case NOTIFICATION_ERROR:
  //     return toast.error(message, configDefault);
  //   case NOTIFICATION_DARK:
  //     return toast.dark(message, configDefault);
  //   default:
  //     return toast(message, configDefault);
  // }
}

export const readAsBinaryString = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        resolve((event.target as FileReader).result);
      } else {
        reject(new Error('Event target is null or undefined.'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

export const trimFieldValues = (values: any) => {
  const trimString = (value: string) => (typeof value === 'string' ? value.trim() : value);

    const trimNestedObject = (obj: any) => {
      const trimmedObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === 'object' && value !== null) {
            trimmedObj[key] = trimNestedObject(value);
          } else {
            trimmedObj[key] = trimString(value);
          }
        }
      }
      return trimmedObj;
    };

    const trimmedValues: any = {};
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const value = values[key];
        if (typeof value === 'object' && value !== null) {
          trimmedValues[key] = trimNestedObject(value);
        } else {
          trimmedValues[key] = trimString(value);
        }
      }
    }
    return trimmedValues;
};