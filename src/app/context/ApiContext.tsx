import React, { createContext, ReactNode, useContext } from 'react';
import { AxiosInstance } from 'axios';
import { useAuth } from './AuthContext';
import { createApi } from '../interceptor/api';

const ApiContext = createContext<AxiosInstance | null>(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi debe ser usado dentro de un ApiProvider');
  }
  return context;
};

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getEnterpriseId } = useAuth();
  const api = createApi(getEnterpriseId);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
