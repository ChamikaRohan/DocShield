import forge from 'node-forge';
import { PDFDocument } from 'pdf-lib';

const getPublicKey = (pem) => {
    return forge.pki.publicKeyFromPem(pem);
};

const digitallyVerify = async (file, publicKey) => {
    try {
        // Get the PDF content as a byte array (excluding the signature field)
        const pdfBytes = file.buffer;
        
        // Create a SHA-256 hash of the PDF content
        const md = forge.md.sha256.create();
        md.update(forge.util.createBuffer(pdfBytes).getBytes());
        
        var publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0ISP1viyqP69jamwgX0
MBG2hC7vvSAci4dyC+5aj5clR0xB8ptJnH4MqrSrSeamDMqPYF5Bu2/tsfynczmL
fu0dm2YjVcZ2OW15EPJU2FyBoGUlxAjwr7ceYHGuIUnKnBPfODOEhIlsrHUVfEdP
zoH61pG5yZDma9Q+7zq0H/JhyjGnuve7ywq8g27EedJHFgUZFKNO88eUEjsY/f6M
jPQrmWjDvVPwagDiCjYX2vutWx/tzSeYNuB6PS1ZhRr63sF8UyxIknFH+tcmF273
EUHCDZyIQdK0spDm95ltdSEG0zstenHAmDlswquB3KUe5x9YAigTwejPzJXD8vRX
wwIDAQAB
-----END PUBLIC KEY-----
`

        publicKey = getPublicKey(publicKey);
        const signature = "awTyA9lSE0XY+6/y2kf+327bSMZeuXYudyy/YTcpPbkSnwQVoX+ItM0aPCQR9mMbpx5l+qjPBmm3TwF1bIk3g7cRaRUtDmoSZTgGIw7iq2qfRtAAF3sA7m+pigYD+Z0hDExvZeTX7z9GEq+nbyckwwMa2m5rJSYLGhUbtUaFuKwj5Yi8RFwm5eRZNeiCTPzHGkSFbCtMCyB/p0cz6blr2eCHNxz8/ybP+rlWJgjzAXuTi8qD7DNdrS0OQh5sJGuphwZBmU/lZx0jlmIWqVIfembHFTdgoDDvRMw+yUT0fZn6VeCt45dnYOzVE5tK5F6eoGquU3tk743ys7GVxDXo8A=="

        // Verify the signature using the public key
        const verified = publicKey.verify(md.digest().bytes(), signature);
        
        return verified;
    } catch (error) {
        console.error('Error verifying PDF:', error);
        throw error;
    }
};

export default digitallyVerify;
