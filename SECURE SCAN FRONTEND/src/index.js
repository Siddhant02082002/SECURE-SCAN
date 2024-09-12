import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './routes/HomePage';
import RootLayout from './routes/RootLayout';
import Dashboard from './components/Dashboard';
import Second from './components/Second';

const router = createBrowserRouter ([
  {
    path:"/",
    element:<RootLayout/>,
    children: [{ path: "/", element: <HomePage/> },
      {path:"/dashboard", element:<Dashboard/>},
      {path:"/second",element:<Second/>},
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
