require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Weather API Endpoint
app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Mumbai';
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

// Leaf Detection API Endpoint (kindwise crop.health)
app.post('/detect_disease', upload.single('image'), async (req, res) => {
  const apiKey = process.env.KINDWISE_API_KEY;
  const url = 'https://api.kindwise.com/v1/crop_health';

  try {
    const imagePath = req.file.path;
    const formData = new FormData();
    formData.append('image', require('fs').createReadStream(imagePath));

    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
    });

    // Assuming kindwise returns a result and confidence
    const result = response.data.disease || 'No disease detected';
    const confidence = response.data.confidence || 'N/A';

    res.json({ result, confidence });
  } catch (error) {
    res.status(500).json({ error: 'Unable to analyze leaf image' });
  } finally {
    // Clean up uploaded file
    if (req.file) require('fs').unlinkSync(req.file.path);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});