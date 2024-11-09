import axios from 'axios';

export const createApi = (getEnterpriseId: () => string | null) => {
  const api = axios.create({
    baseURL: 'https://fleet-manager-vrxj.onrender.com/api',
  });

  api.interceptors.request.use((config) => {
    const enterpriseId = getEnterpriseId();
    if (enterpriseId) {
      if (config.method === 'get' || config.method === 'delete') {
        config.params = { ...config.params, enterprise_id: enterpriseId };
      } else if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
        config.data = { ...config.data, enterprise_id: enterpriseId };
      }
    }
    return config;
  });

  return api;
};