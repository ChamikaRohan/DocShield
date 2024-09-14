import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CheckAuth from './components/CheckAuth.jsx';
import SocketClient from './components/SocketClient.jsx';
import SignInPage from './components/SignInPage.jsx';
import ViewMyDocs from './components/ViewMyDocs.jsx';
import SignUpPage from './components/Signup.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/docs" element={<ViewMyDocs />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/socket" element={<SocketClient />} /> 
      </Routes>
    </Router>
  );
}
