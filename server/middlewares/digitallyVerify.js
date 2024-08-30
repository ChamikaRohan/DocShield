import forge from 'node-forge';
import { PDFDocument } from 'pdf-lib';

const getPublicKey = (pem) => {
    return forge.pki.publicKeyFromPem(pem);
};

const digitallyVerify = async (req, res, next) => {
    try {
        const pdfBytes = req.file.buffer;
        const publicKeyPem = req.body.publicKeyData;
        const signatureBase64 = req.body.signatureData;

        console.log(publicKeyPem);
        console.log(signatureBase64);

        const md = forge.md.sha256.create();
        md.update(pdfBytes.toString('binary'));

        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const signature = forge.util.decode64(signatureBase64);

        const verified = publicKey.verify(md.digest().bytes(), signature);

        if (!verified) {
            return res.status(401).json({ error: 'Signature verification failed!' });
        }
        console.log(verified);
        next();
    } catch (error) {
        console.error('Error verifying PDF:', error);
        throw error;
    }
};

export default digitallyVerify;
