import React, { useState, useEffect } from 'react';
import { retriveUserID } from '../middlewares/RetriveUserID.js'; // Import your email retrieval method

export default function ViewMyDocs() {
    const [documents, setDocuments] = useState([]);
    const [senders, setSenders] = useState([]);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    const apiURL = import.meta.env.VITE_SERVER_BASE_URL;

    // Fetch the logged-in user's email
    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                const userEmail = await retriveUserID();
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

    // Fetch documents using the logged-in user's email
    useEffect(() => {
        const fetchUserDocs = async () => {
            if (!email) return;

            try {
                const response = await fetch(`${apiURL}/api/user/get-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }), // Pass the retrieved email
                });

                if (response.ok) {
                    const userData = await response.json();
                    setDocuments(userData.documents || []);
                    setSenders(userData.senders || []);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch documents');
                }
            } catch (error) {
                setError('An error occurred while fetching your documents');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDocs();
    }, [email, apiURL]);

    // Function to extract the document name, date, and time from the document URL
    const extractDocNameAndDate = (docUrl) => {
      if (!docUrl || typeof docUrl !== 'string') {
          return { name: 'Unknown', date: 'Unknown', time: 'Unknown' };
      }
  
      try {
          const fileNameWithQuery = docUrl.split('/').pop(); // Get the last part of the URL
          const fileName = fileNameWithQuery.split('?')[0]; // Remove query params
          const decodedFileName = decodeURIComponent(fileName); // Decode any URL encoding
  
          // Remove any leading directories (e.g., 'docs/')
          const fileNameOnly = decodedFileName.split('/').pop(); // Get 'new1_2024-09-08_19-33-56.pdf'
  
          // Split the filename to extract name, date, and time
          const [nameWithExt, datePart, timePartAndExt] = fileNameOnly.split('_');
  
          // Remove the file extension from the name
          const name = nameWithExt.includes('.pdf') ? nameWithExt.replace('.pdf', '') : nameWithExt;
  
          // Extract time and remove the '.pdf' extension
          let time = '';
          if (timePartAndExt) {
              const timePart = timePartAndExt.replace('.pdf', ''); // Remove .pdf extension from time part
              const [hour24, minute] = timePart.split('-'); // Split time into hour and minute (24-hour format)
  
              // Convert hour from 24-hour format to 12-hour format
              let hour12 = parseInt(hour24, 10);
              const ampm = hour12 >= 12 ? 'PM' : 'AM'; // Determine AM/PM
              hour12 = hour12 % 12 || 12; // Convert hour to 12-hour format
  
              time = `${hour12}:${minute}${ampm}`; // Format time as HH:MM AM/PM
          }
  
          const date = datePart || 'Unknown';
  
          return { name, date, time };
      } catch (err) {
          console.error('Error extracting name and date:', err);
          return { name: 'Unknown', date: 'Unknown', time: 'Unknown' };
      }
  };
  
  
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h1>Your Documents</h1>
            {documents.length > 0 ? (
                <ul>
                    {documents.map((docUrl, index) => {
                        const { name, date, time } = extractDocNameAndDate(docUrl);
                        return (
                            <li key={index}>
                                <strong>Document Name:</strong> {name}
                                <br />
                                <strong>Sent on:</strong> {date} {time ? `at ${time}` : ''}
                                <br />
                                <strong>Sender:</strong> {senders[index] || 'Unknown'}
                                <br />
                                <strong>Document URL:</strong>{' '}
                                <a href={docUrl} target="_blank" rel="noopener noreferrer">
                                    {docUrl}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No documents found.</p>
            )}
        </div>
    );
}
