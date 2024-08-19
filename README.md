# DocShield
DocShield is a real-time secure document sharing platform built with the MERN stack, utilizing Socket.IO for live collaboration, and integrating advanced digital signature technology to ensure document integrity and authenticity.

## Overview:  
The project aims to develop a web application that allows users to securely sign documents 
and verify their authenticity using Digital Signatures. This system enhances document security 
and integrity by leveraging digital signatures and cryptographic principles. 
 
## Key Security Principles Applied: 
1. Data Integrity 
 
• Hash Functions: Cryptographic hash functions generate unique hash values of 
documents before and after signing which can be utilized to detect any changes to 
the document’s content. 
 
• Digital Signatures: Integrity is further reinforced by digital signatures, where the 
hash of the document is encrypted with the signer's private key. This ensures that 
any modification to the document after signing results in failing the verification. 
 
2. Confidentiality 
 
• Secure Key Management: Private keys used for digital signing are stored 
encrypted and accessed only by authorized processes preventing unauthorized 
access. 
 
• Access Control: User authentication and authorization mechanisms ensure that 
only authorized users have access to sign and verify PDF documents, maintaining 
confidentiality and preventing unauthorized operations. 
 
3. Availability 
 
• Deploy the application on reliable cloud infrastructure with scalable resources to 
ensure continuous availability and uptime.
