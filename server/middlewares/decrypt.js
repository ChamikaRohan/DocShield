import dotenv from 'dotenv';
import crypto from 'crypto';
import { PDFDocument } from 'pdf-lib';

dotenv.config();

// Helper function to decrypt AES-encrypted file data
const decryptAES = (encryptedData, aesKey) => {
    // Convert base64 encoded data to buffer
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');

    // Extract the IV and encrypted data
    const iv = encryptedBuffer.slice(0, 16); // Assuming 16 bytes IV length
    const encryptedText = encryptedBuffer.slice(16);

    // Convert AES key from base64 to Buffer
    const keyBuffer = Buffer.from(aesKey, 'hex'); // AES key should be hex encoded

    // Create decipher instance
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decrypted;
};

// Middleware function to handle decryption
const decrypt = async (req, res, next) => {
    try {
        const aesKey = process.env.AES_SECRET;
        const encryptedFile = req.body.encryptedFile;

        if (!aesKey || !encryptedFile) {
            return res.status(400).json({ error: 'Missing AES key or encrypted file' });
        }

        // Decrypt the file
        const decryptedBuffer = decryptAES(encryptedFile, aesKey);

        // Save the decrypted file to req object
        req.file = decryptedBuffer;
        
        next();
    } catch (error) {
        console.error('Error decrypting file:', error);
        res.status(500).json({ error: 'Decryption failed' });
    }
};

export default decrypt;
