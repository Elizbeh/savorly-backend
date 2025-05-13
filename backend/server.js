import 'dotenv/config'; // Load environment variables
import fs from 'fs';
import https from 'https';
import app from './app.js';
import './cronJob.js'; 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

/*// Load SSL cert and key
const key = fs.readFileSync('./cert/key.pem');
const cert = fs.readFileSync('./cert/cert.pem');

// Start the server
https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`🚀 HTTPS Server running at https://localhost:${PORT}`);
});*/