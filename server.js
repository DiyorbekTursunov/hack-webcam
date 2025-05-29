const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/upload', (req, res) => {
  const imageData = req.body.image;

  if (!imageData) {
    return res.status(400).send('No image data received');
  }

  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  const timestamp = Date.now();
  const filename = path.join(uploadDir, `image_${timestamp}.png`);

  fs.writeFile(filename, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Failed to save image:', err);
      return res.status(500).send('Server error');
    }
    console.log(`Saved ${filename}`);
    res.send('Image received and saved');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
