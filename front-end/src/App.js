import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ConditionalNavbar from './components/ConditionalNavbar';
import Hero from './components/Hero';
import OpportunitySection from './components/OpportunitySection';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';
import SavedApplications from './pages/SavedApplications';
import JobDetails from './pages/JobDetails';
import WhyChooseUs from './components/WhyChooseUs';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  return (
    <>
      <ConditionalNavbar />

      <Routes>
        <Route
          path="/login"
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={!isLoggedIn ? <Hero /> : <Navigate to="/dashboard" />}
        />
        <Route path="/post-job" element={<PostJob />} />
        <Route
          path="/saved-applications"
          element={isLoggedIn ? <SavedApplications /> : <Navigate to="/login" />}
        />
       <Route path="/job-details/:id" element={isLoggedIn ? <JobDetails /> : <Navigate to="/login" />} />

      </Routes>

      {!isLoggedIn && (
        <>

          <OpportunitySection />
          <WhyChooseUs/>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
