import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CheckAuth from './components/CheckAuth.jsx';
import ViewMyDocs from './components/ViewMyDocs.jsx';
import Inbox from './pages/Inbox.jsx';
import Compose from './pages/Compose.jsx';
import Login from './pages/Login.jsx';
import './App.css';
import ForgotPasswordPage from './pages/forgot-password.jsx';
import SignUpPage from './pages/Signup.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect from "/" to "/signin" */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/compose" element={<Compose />} /> 
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/docs" element={<ViewMyDocs />} />
        <Route path="/forgotpw" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}
