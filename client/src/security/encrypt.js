import forge from 'node-forge';
import CryptoJS from 'crypto-js';

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
const aesEncryptFile = (fileData, aesKey) => {
    // Convert Uint8Array to a WordArray
    const wordArray = CryptoJS.lib.WordArray.create(fileData);
    
    // Ensure aesKey is properly converted to a WordArray
    const keyWordArray = CryptoJS.enc.Hex.parse(aesKey);

    // Encrypt the file using AES
    const encrypted = CryptoJS.AES.encrypt(wordArray, keyWordArray, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};


// RSA Encryption for AES key
const rsaEncryptKey = (aesKey, recieversPublicKeyPem) => {
    const recieversPublicKey = forge.pki.publicKeyFromPem(recieversPublicKeyPem);
    // Encode the AES key as a string for RSA encryption
    const encryptedKey = recieversPublicKey.encrypt(aesKey, 'RSA-OAEP');
    return forge.util.encode64(encryptedKey); // Encode the encrypted key in base64
};

// Main encryption function
const encrypt = async (selectedFile, signatureBase64, recieversPublicKeyPem) => {
    try {
        // Read the file into ArrayBuffer and convert to Uint8Array
        const arrayBuffer = await selectedFile.arrayBuffer();
        const fileData = new Uint8Array(arrayBuffer);

        // Combine file and signature into a single array
        const signatureArray = new TextEncoder().encode(signatureBase64);
        const combinedFile = new Uint8Array([...signatureArray, ...fileData]);

        // Step 1: Generate a random AES key for file encryption
        const aesKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex); // 256-bit AES key
        console.log(aesKey);

        // Step 2: Encrypt the file using AES
        const encryptedFile = aesEncryptFile(combinedFile, aesKey);

        // Step 3: Encrypt the AES key using RSA
        const encryptedKey = rsaEncryptKey(aesKey, recieversPublicKeyPem);

        // Step 4: Save the encrypted file and key
        downloadFile(encryptedFile, 'encryptedFile.dat');
        downloadFile(encryptedKey, 'encryptedKey.dat');

        return { encryptedFile, encryptedKey };
    } catch (error) {
        console.error('Error encrypting file and signature:', error);
        throw error;
    }
};

export default encrypt;
