import forge from 'node-forge';
import { PDFDocument } from 'pdf-lib';
import { getPublicKeyByEmail } from "../controllers/user.controller.js"

const getPublicKey = (pem) => {
    return forge.pki.publicKeyFromPem(pem);
};

const digitallyVerify = async (req, res, next) => {
    try {
        const pdfBytes = req.file;
        const senderEmail = req.body.sender;
        const publicKeyPem = await getPublicKeyByEmail(senderEmail);
        const signatureBase64 = req.body.signatureData;

        const md = forge.md.sha256.create();
        md.update(pdfBytes.toString('binary'));

        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const signature = forge.util.decode64(signatureBase64);

        const verified = publicKey.verify(md.digest().bytes(), signature);

        if (!verified) {
            return res.status(401).json({ error: 'Signature verification failed!' });
        }

        next();
    } catch (error) {
        console.error('Error verifying PDF:', error);
        res.status(500).json({message: error});
    }
};

export default digitallyVerify;
