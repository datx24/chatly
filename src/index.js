import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route } from 'react-router-dom'; // Sử dụng Routes và Route thay vì BrowserRouter
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/components/login/login';
import GiaoDienChinh from '../src/components/list/list';
import App from './App';
import { SearchProvider } from './components/lib/searchContext'; // Import SearchProvider


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
  <BrowserRouter>
  <SearchProvider>
  <Routes>
    <Route path='/' element={<App />} />
    <Route path='/login' element={<Login />} />
  </Routes>
  </SearchProvider>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals