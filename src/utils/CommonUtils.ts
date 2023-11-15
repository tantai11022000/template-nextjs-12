import qs from 'query-string';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';

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

export const notificationSimple = (message: string, level: string, position?: string) => {
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

  switch (level) {
    case NOTIFICATION_SUCCESS:
      return toast.success(message, configDefault);
    case NOTIFICATION_WARN:
      return toast.warn(message, configDefault);
    case NOTIFICATION_INFO:
      return toast.info(message, configDefault);
    case NOTIFICATION_ERROR:
      return toast.error(message, configDefault);
    case NOTIFICATION_DARK:
      return toast.dark(message, configDefault);
    default:
      return toast(message, configDefault);
  }
}