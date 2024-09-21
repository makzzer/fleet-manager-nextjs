import { AppProps } from 'next/app';
import { VehiculoProvider } from '../context/VehiculoContext';
import { StrictMode } from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <StrictMode>
      <VehiculoProvider>
        <Component {...pageProps} />
      </VehiculoProvider>
    </StrictMode>
  );
};

export default MyApp;
