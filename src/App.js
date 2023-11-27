import './App.css'
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { StoreProvider } from './context/StoreContext';
import Router from './routers/Router';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <StoreProvider>
      <BrowserRouter>
        <Router />
        <ToastContainer
          theme="colored"
        />
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
