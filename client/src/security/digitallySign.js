import forge from 'node-forge';

const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const digitallySign = async (file, privateKeyPem) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

        const md = forge.md.sha256.create();
        
        const buffer = forge.util.createBuffer(pdfData);
        while (!buffer.isEmpty()) {
            const chunk = buffer.getBytes(1024); 
            md.update(chunk);
        }

        const signature = privateKey.sign(md);
        const signatureBase64 = forge.util.encode64(signature);
        downloadFile(signatureBase64, 'signature.txt');

        return signatureBase64;
    } catch (error) {
        console.error('Error signing PDF:', error);
        throw error;
    }
};

export default digitallySign;
