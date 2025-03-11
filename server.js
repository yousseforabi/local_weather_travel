const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.text());

const TRAFIKVERKET_API = 'https://api.trafikinfo.trafikverket.se/v2/data.xml';

app.post('/api/trafikverket', async (req, res) => {
    try {
        const response = await axios.post(TRAFIKVERKET_API, req.body, {
            headers: {
                'Content-Type': 'text/xml',
                'Accept': 'application/xml'
            }
        });
        res.send(response.data);
    } catch (error) {
        console.error('Proxy error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
}); 