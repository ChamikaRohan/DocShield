import forge from 'node-forge';
import CryptoJS from 'crypto-js';

const aesKey = import.meta.env.VITE_AES_KEY;

// Helper to download file
const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// AES Encryption for file
// AES Encryption for file
const aesEncryptFile = (fileData, aesKey) => {
    // Convert Uint8Array to a WordArray for CryptoJS
    const wordArray = CryptoJS.lib.WordArray.create(fileData);
    
    // Ensure aesKey is properly converted to a WordArray
    const keyWordArray = CryptoJS.enc.Hex.parse(aesKey);

    // Generate a random Initialization Vector (IV) for AES
    const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV for AES-CBC mode

    // Encrypt the file using AES with the key and IV
    const encrypted = CryptoJS.AES.encrypt(wordArray, keyWordArray, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Concatenate the IV with the encrypted file (IV is needed for decryption)
    const encryptedWithIv = iv.concat(encrypted.ciphertext);

    return encryptedWithIv.toString(CryptoJS.enc.Base64); // Return as base64 string
};


// RSA Encryption for AES key
const rsaEncryptKey = (aesKey, recieversPublicKeyPem) => {
    const recieversPublicKey = forge.pki.publicKeyFromPem(recieversPublicKeyPem);
    // Encrypt the AES key using the receiver's public RSA key
    const encryptedKey = recieversPublicKey.encrypt(aesKey, 'RSA-OAEP');
    return forge.util.encode64(encryptedKey); // Encode the encrypted key in base64
};

// Main encryption function
const encrypt = async (selectedFile, signatureBase64, recieversPublicKeyPem) => {
    try {
        // Step 1: Read the PDF file as an ArrayBuffer
        const fileData = await selectedFile.arrayBuffer();
        
        // Step 3: Encrypt the file data using AES
        const encryptedFile = aesEncryptFile(new Uint8Array(fileData), aesKey);

        // Step 4: Encrypt the AES key using the receiver's public RSA key
        const encryptedAESKey = rsaEncryptKey(aesKey, recieversPublicKeyPem);

        // Step 5: Combine signature, encrypted AES key, and encrypted file data
        const combinedData = JSON.stringify({
            signature: signatureBase64,
            encryptedAESKey: encryptedAESKey,
            encryptedFile: encryptedFile,
        });

        // Optional: Download the encrypted file for testing purposes
        downloadFile(combinedData, 'encrypted_file.json');

        return { encryptedFile, encryptedAESKey };
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed');
    }
};

export default encrypt;
