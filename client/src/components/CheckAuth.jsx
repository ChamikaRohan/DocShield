import React, { useEffect, useState } from 'react';
import { retriveUserID } from '../middlewares/RetriveUserID.js'; // Adjust the import path based on your file structure

function CheckAuth() {
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userEmail = await retriveUserID();
        console.log(userEmail);
        if (userEmail.user) {
          setEmail(userEmail.email);
        } else {
          setError('Unauthorized or Invalid token');
        }
      } catch (err) {
        setError('An error occurred while checking the auth status.');
      }
    };

    checkUserAuth();
  }, []);

  return (
    <div>
      <h2>Authentication Status</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p style={{ color: 'green' }}>Authenticated User: {email}</p>
      )}
    </div>
  );
}

export default CheckAuth;
