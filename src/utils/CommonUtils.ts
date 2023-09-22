import qs from 'query-string';
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