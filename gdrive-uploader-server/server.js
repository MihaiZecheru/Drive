// server.js
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Load service account credentials from JSON file
const serviceAccount = require('./credentials.json');

// Initialize Google Drive API
const drive = google.drive('v3');
const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/drive.file']
);

// Authorize once at startup
const authorize = async () => {
  await jwtClient.authorize();
};

// Call authorize on startup
authorize();

// Reauthorize every 30 minutes
setInterval(authorize, 1000 * 60 * 50);

app.get('/', (req, res) => {
  res.send('App online. Use /gdrive/upload to upload a file');
});

app.post('/gdrive/upload', upload.single('file'), async (req, res) => {
  const { file } = req;

  try {
    // Check if the access token is available and reauthorize if necessary
    if (!jwtClient.credentials || !jwtClient.credentials.access_token) {
      await jwtClient.authorize();
    }

    const fileMetadata = {
      name: file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
      auth: jwtClient,
    });

    // Clean up the uploaded file from the server
    fs.unlinkSync(file.path);
    res.status(200).json({ fileId: response.data.id });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

/**
 * File ID is the ID of the file in Google Drive
 */
app.get('/gdrive/download/:file_id', async (req, res) => {
  const { file_id } = req.params;

  try {
    // Ensure JWT client is authorized
    if (!jwtClient.credentials || !jwtClient.credentials.access_token) {
      await jwtClient.authorize();
    }

    const url = `https://www.googleapis.com/drive/v3/files/${file_id}?alt=media`;

    // Download the file as a stream
    const response = await axios({
      url,
      method: 'GET',
      headers: { Authorization: `Bearer ${jwtClient.credentials.access_token}` },
      responseType: 'stream',  // Axios handles the stream correctly
    });

    // Set appropriate headers (optional)
    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Length': response.headers['content-length'],
    });

    // Pipe the file stream directly to the response
    response.data.pipe(res);

  } catch (error) {
    console.error('Error fetching file:', error.message);
    res.status(500).send('Error fetching file');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
