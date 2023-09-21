const config = {
    api: {
      host: process.env.NEXT_PUBLIC_API_URL
    },
    global: {
      subUrl: process.env.NEXT_PUBLIC_SUB_URL,
    },
  }

  
  const API_HOST = config.api.host;
  const SUB_URL = config.global.subUrl;
  export {
    API_HOST,
    SUB_URL,
  }
  
  export default config