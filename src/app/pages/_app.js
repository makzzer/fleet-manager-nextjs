import {VehiculoProvider} from "../context/VehiculoContext"
import { StrictMode } from 'react';

const App = ({ Component, pageProps }) => {
  return (
    
    <StrictMode>
    <VehiculoProvider>
      <Component {...pageProps} />
    </VehiculoProvider>
  </StrictMode>
    
  );
};

export default App;
