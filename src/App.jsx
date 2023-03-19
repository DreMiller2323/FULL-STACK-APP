import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Header from './components/Nav/Header';
import Home from './Pages/Auth/Home';
import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import BuildRoster from './Pages/Auth/BuildRoster';
import {AuthProvider} from './globalAuth/appAuth/AuthProvider';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="buildroster" element={<BuildRoster />} />

  

    </Route>
  )
)

function App({routes}) {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
