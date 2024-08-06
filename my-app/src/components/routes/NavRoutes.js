// src/components/NavRoutes.js

import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Adjust the import path accordingly
import Login from '../Registering/login'; // Adjust the import path accordingly
import Registration from '../Registering/register';
import ResetPassword from '../Registering/ResetPassword';
import Profile from '../Registering/Profile';


const NavRoutes = () => {
  return (
    <Routes>

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Registration/>} />
<Route path="/resetpassword" element={<ResetPassword />} />  
<Route path="/profile" element={<Profile/>} />

      
    </Routes>
  );
};

export default NavRoutes;
