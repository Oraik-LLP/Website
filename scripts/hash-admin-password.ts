import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { createInterface } from 'node:readline/promises';

const scrypt = promisify(scryptCallback);
const terminal = createInterface({ input: process.stdin, output: process.stdout });
const password = await terminal.question('Admin password: ');
terminal.close();

if (password.length < 14) {
  console.error('Use at least 14 characters.');
  process.exit(1);
}

const salt = randomBytes(24).toString('base64url');
const derived = (await scrypt(password, salt, 64)) as Buffer;
console.log(`${salt}:${derived.toString('hex')}`);

