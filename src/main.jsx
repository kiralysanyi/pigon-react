import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import Index from './Index';
import Login from './Login';
import Register from './Register';
import "./styles/index.css"
import App from './App';
import Settings from './Settings';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/app' element={<App />} />
      <Route path='/settings' element={<Settings />} />
    </Routes>
  </BrowserRouter>
)
