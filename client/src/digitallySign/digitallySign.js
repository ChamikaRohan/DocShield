import forge from 'node-forge';
import { PDFDocument } from 'pdf-lib';

const digitallySign = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);

        // Generate RSA key pair
        const keypair = forge.pki.rsa.generateKeyPair(2048);
        const privateKey = keypair.privateKey;
        const publicKey = keypair.publicKey;

        // Create SHA-256 message digest and sign it
        const md = forge.md.sha256.create();
        md.update(pdfData.toString('binary'));
        const signature = privateKey.sign(md);

        // Convert public key and signature to PEM and Base64 formats
        const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
        const signatureBase64 = forge.util.encode64(signature);

        // Load the PDF document using pdf-lib
        const pdfDoc = await PDFDocument.load(pdfData);

        // Update the 'Keywords' field with a comma-separated string
        const metadataKeywords = `${signatureBase64},${publicKeyPem}`;
        pdfDoc.setKeywords([metadataKeywords]);

        // Save the modified PDF and convert it to a Blob
        const modifiedPdfBytes = await pdfDoc.save();
        const signedBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

        return signedBlob;
    } catch (error) {
        console.error('Error signing PDF:', error);
        throw error;
    }
};

export default digitallySign;
