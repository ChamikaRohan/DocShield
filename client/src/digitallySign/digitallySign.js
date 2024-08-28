import forge from 'node-forge';
import { PDFDocument } from 'pdf-lib';

const digitallySign = async (file, signingKey) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);
        
        // Generate keys (for demonstration purposes)
        const keypair = forge.pki.rsa.generateKeyPair(2048);
        const privateKey = keypair.privateKey;
        const publicKey = keypair.publicKey;

        // Sign the PDF file using the private key
        const md = forge.md.sha256.create();
        md.update(pdfData.toString('binary'));
        const signature = privateKey.sign(md);

        // Convert public key and signature to PEM format
        const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
        const signatureBase64 = forge.util.encode64(signature);

        // Prepare the content for the .txt file
        const fileContent = `Public Key:\n${publicKeyPem}\n\nSignature:\n${signatureBase64}`;
        
        // Create a Blob from the file content
        const blob = new Blob([fileContent], { type: 'text/plain' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'signature-info.txt';
        a.click();
        
        // Clean up the URL object
        URL.revokeObjectURL(url);

        console.log('Signature info file has been downloaded.');
        
    } catch (error) {
        console.error('Error signing PDF:', error);
        throw error;
    }
};

export default digitallySign;
