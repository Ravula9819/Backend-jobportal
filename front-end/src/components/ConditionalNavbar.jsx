import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/dashboard', '/saved-applications','/post-job'];

  // Hide for exact matches or dynamic paths like /job-details/:id
  const shouldHide = hideNavbarRoutes.includes(location.pathname) || location.pathname.startsWith('/job-details');

  return !shouldHide ? <Navbar /> : null;
};

export default ConditionalNavbar;
