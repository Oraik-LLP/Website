import { generateSecret, generateURI } from 'otplib';

const secret = generateSecret();
const uri = generateURI({
  issuer: 'Oraik Systems',
  label: 'Oraik Engine Admin',
  secret,
});

console.log('Add this account to your authenticator app, then store the secret in Vercel.');
console.log(`ADMIN_TOTP_SECRET=${secret}`);
console.log(`Enrollment URI: ${uri}`);
