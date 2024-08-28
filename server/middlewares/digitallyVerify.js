import forge from 'node-forge';
import { PDFDocument } from 'pdf-lib';

const getPublicKey = (pem) => {
    return forge.pki.publicKeyFromPem(pem);
};

const digitallyVerify = async (req, res, next) => {
    try {
        const pdfBytes = req.file.buffer;
        const md = forge.md.sha256.create();
        md.update(pdfBytes.toString('binary'));

        const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4HBgSYjcj+rAl0X7d50Q
LNIcVzISwzG5aOe+gNNulfGk/kMZ7FIYwZI0eV1YC2VNd0CqnqA/3ilBrNIZjOiN
DwNz24yiqvYmBQJNF0gohpX1G+m8Ik6lxStOXb+XN2P4H8lg9Hlu4FeJUZVdxlv5
AXm63mjAFB+VaIvp8meGDlyQN8G66/cU0yAJl9OyALWq/yQuKON1oSUfaSg2AgKN
Gl3+qQVuZmN5OcINwNqj7u+NoldZHO716zdYAKbMT7D0VWAR+sVRqvl1W4ROpt6+
MuLviseTE1LnzbNoa9kcr8VE29SpPbgSee/xuBAy748TznskRKWsiWhIPB1FuWXs
7wIDAQAB
-----END PUBLIC KEY-----
`;
        const signatureBase64 = "gr8BNToJBiLrNqDCvSF433TWAc4H9XdBkMdlLsrDUQYuQgkguHw221qRRHekb2ugnSZ/tJTikTXWepubcY8zMOkdzJCdAoyEq8/gGiYZT6BuIX0JK6kxOFLB3TnI9JoaWTazwv72b01G7GsH2LV8t5Ec1CMjoUcW0eKHPdpNXvB6a/2q+j3A06Mk1zCsVeaTL1jh8V61HZV09+27hZAxbjWUb0iaGBziy7qs70/RpXyAPbghPgh1NMWQpMQjRH5EAfjE8Okedl2KBvhJ8iEhNackp518iYyU/B6z44Y5HRTPO8KIBqBl91/AEzrQRXwhrMP39FoXMfd4TuGak9u3tw==";

        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const signature = forge.util.decode64(signatureBase64);

        const verified = publicKey.verify(md.digest().bytes(), signature);

        if (!verified) {
            return res.status(401).json({ error: 'Signature verification failed!' });
        }

        next();
    } catch (error) {
        console.error('Error verifying PDF:', error);
        throw error;
    }
};

export default digitallyVerify;
