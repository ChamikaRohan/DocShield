import React, { useEffect, useState } from 'react'; 
import Navbar from '../components/Navbar';
import DocCard from '../components/DocCard';
import './inbox.css';

const Inbox = () => {
  const [columns, setColumns] = useState('repeat(4, 1fr)'); 

  const updateColumns = () => {
    const width = window.innerWidth;
    if (width < 600) {
      setColumns('repeat(1, 1fr)'); 
    } else if (width < 768) {
      setColumns('repeat(2, 1fr)'); 
    } else if (width < 1024) {
      setColumns('repeat(3, 1fr)'); 
    } else {
      setColumns('repeat(4, 1fr)'); 
    }
  };

  useEffect(() => {
    updateColumns(); 
    window.addEventListener('resize', updateColumns); 

    return () => {
      window.removeEventListener('resize', updateColumns); 
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div
        style={{
          padding: '80px',
          margin: '5px',
          marginBottom: '25px',
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: columns, 
          gap: '45px',
          justifyItems: 'center',
          mx: 'auto',
          my: 'auto',
        }}
      >
        {[...Array(8)].map((_, index) => (
          <DocCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default Inbox;
