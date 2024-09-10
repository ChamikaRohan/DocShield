import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './compose.css';

const Compose = () => {
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const isIDFound = 1; 
  
 
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        const fileURL = URL.createObjectURL(selectedFile);
        setFilePreview(fileURL);
      } else {
        setFile(null);
        setFilePreview(null);
      }
    };


    const handleFileClick = () => {
        if (filePreview) {
          window.open(filePreview, '_blank');
        }
    };

 
    const handleFileDelete = () => {
        setFile(null);
        setFilePreview(null);
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '10px', margin: '25px', alignItems: 'center', marginTop: '80px' }}>
               
                {isIDFound ? (
                    <div style={{ display: 'flex' }}>

                        <div className="" style={{ margin: '0 auto',  display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth:'1000px' }}>

                            <span style={{ marginBottom: '15px' ,color:'teal' , fontWeight:'500px',fontSize:"16px"}}>You are connected with:</span>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>

                            <button className="user-container-button" style={{ maxWidth: '1200px', letterSpacing: '0.15rem', fontSize: '16px', fontWeight: '400px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="20px"
                                    height="20px"
                                >
                                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.674 0-11 1.839-11 5.5v2.5h22v-2.5c0-3.661-7.326-5.5-11-5.5z"/>
                                </svg>
                                Sandunika Thanthriwatta
                            </button>

                            <button class="Btn">
                                <div class="sign">
                                    <svg
                                    viewBox="0 0 16 16"
                                    class="bi bi-trash3-fill"
                                    fill="currentColor"
                                    height="18"
                                    width="18"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <path
                                        d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                                    ></path>
                                    </svg>
                                </div>

                                <div class="text">Delete</div>
                            </button>

                            </div>
                            
                         </div>
                     </div>
                ) : (
                    <div style={{ display: 'flex', padding: '10px' }}>
                        <div className="input-container" style={{ margin: '0 auto' }}>
                            <input placeholder="Enter Receiver's ID" type="text" />
                            <button className="button">Connect</button>
                        </div>
                    </div>
                )}

              
                <div style={{ padding: '10px' }}>
                    <div className="container" style={{ display: 'flex', justifyContent: 'center', margin: '20px auto' }}>
                        <div className="header">
                        <svg
                            
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                width: '50px',
                                height: '50px',
                                
                            }}
                           
                            >                                
                            <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="coral" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            <p style={{ color:'#36454F' }}>Browse File to upload!</p>
                        </div>

                        <label htmlFor="file" className="footer">
                        <svg
                            fill="#000000"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                            width: '40px', 
                            height: '40px',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                                <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
                                <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
                            </svg>
                            {!file && <p style={{ color:'#36454F' }}>Not selected file</p>}
                            {file && (
                                <p onClick={handleFileClick} style={{ cursor: 'pointer', color: 'teal' }}>
                                    Selected file: {file.name}
                                </p>
                            )}
                            <svg
                                onClick={handleFileDelete}
                                fill="#000000"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                width: '35px', 
                                height: '35px',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" strokeWidth="2"></path>
                                <path d="M19.5 5H4.5" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
                                <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" strokeWidth="2"></path>
                            </svg>
                        </label>
                        <input id="file" type="file" onChange={handleFileChange} />
                    </div>
                </div>

                <div style={{ marginTop: '5px', marginBottom: '35px', alignItems: 'center' }}>
                    <div className="input-container" style={{ margin: '0 auto', maxWidth: '350px', maxHeight: '50px' }}>
                        <textarea placeholder="Enter Document Title" type="text" />
                        <button className="button">Send</button>
                    </div>
                </div>

                <button className="button" style={{ marginTop: '15px', padding: '10px', marginLeft: 'auto', marginRight: 'auto' }}>
                    SEND DOCUMENT
                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Compose;
