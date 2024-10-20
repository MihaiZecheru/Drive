// server.js
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const cors = require('cors');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

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

authorize(); // Call authorize on startup

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
