import forge from 'node-forge';
import { PDFDocument } from 'pdf-lib';

const digitallySign = async (file, signingKey) => {
    try {
        // Convert the File object to an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Load the PDF document from the ArrayBuffer
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Get the first page (or any other page you want to modify)
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        
        // Generate keys
        const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);

        // Sign the PDF (this is a simplified example, real-world signing is more complex)
        const signature = forge.md.sha256.create();
        signature.update(arrayBuffer, 'utf8');
        const signedPdf = privateKey.sign(signature);

        // Add a visible signature (optional)
        firstPage.drawText(`Signed by: ${signingKey}`, {
            x: 50,
            y: height - 50,
            size: 12,
        });

        // Save the signed PDF and convert it to a Blob for download
        const signedPdfBytes = await pdfDoc.save();
        const signedPdfBlob = new Blob([signedPdfBytes], { type: 'application/pdf' });

        // Return the Blob to be downloaded or processed further
        return signedPdfBlob;
    } catch (error) {
        console.error('Error signing PDF:', error);
    }
};

export default digitallySign;
