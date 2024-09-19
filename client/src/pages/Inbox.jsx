import React from 'react'
import Navbar from '../components/Navbar'
import DocCard from '../components/DocCard';

const Inbox = () => {
  return (
    <div>
      <Navbar/>
        <div style={{ padding: '80px',justifyContent: 'center',mx:'auto',  margin: '5px',marginBottom: '25px', columnGap: '0px', marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '45px',justifyItems: 'center',my:'auto' }}>
            {[...Array(8)].map((_, index) => (
              <DocCard key={index} />
            ))}
        </div>
    </div>
    
  )
}

export default Inbox;