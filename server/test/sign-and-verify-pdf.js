import fs from 'fs';
import forge from 'node-forge';

// Load the PDF file
const pdfPath = './test.pdf';
const pdfData = fs.readFileSync(pdfPath);
console.log(pdfData);

// Generate keys (for demonstration purposes)
const keypair = forge.pki.rsa.generateKeyPair(2048);
const privateKey = keypair.privateKey;
const publicKey = keypair.publicKey;

// Sign the PDF file using the private key
const md = forge.md.sha256.create();
md.update(pdfData.toString('binary'));
const signature = privateKey.sign(md);

// Save the signature to a file (optional)
const signaturePath = './test_signature.txt';
fs.writeFileSync(signaturePath, forge.util.encode64(signature));

// Verify the signature using the public key
const verified = publicKey.verify(md.digest().bytes(), signature);

console.log('Signature verified:', verified ? 'Valid' : 'Invalid');

// Optional: Save the public key to a file for later verification
const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
fs.writeFileSync('./public_key.pem', publicKeyPem);

// Optional: Save the private key to a file (for testing purposes)
const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
fs.writeFileSync('./private_key.pem', privateKeyPem);
