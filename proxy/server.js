import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 4000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.post('/image/generation', async (req, res) => {
    try {
        const response = await fetch('https://api.limewire.com/api/image/generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Version': 'v1',
                'Accept': 'application/json',
                'Authorization': 'Bearer lmwr_sk_zfbP7B5i70_QRoisWXVPhYdytUc7Fb3U9TVPhfFCq15aCie0'
            },
            body: JSON.stringify({
                prompt: req.body.prompt,
                aspect_ratio: req.body.aspect_ratio || '1:1',
                style: req.body.style || 'PHOTOREALISTIC'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from API:', errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send('Error generating image');
    }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});

