const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const port = 3000;
app.use(cors());
const appID = '3d607c3ea1ec43d1a535993e0fc5d5f1';
const appCertificate = '39c50f4bb20443cfb46d67fdab71e3cb';
const tokenExpirationTimeInSeconds = 3600;
const privilegeExpirationTimeInSeconds = 3600;

app.get('/rtcToken', (req, res) => {
    const channelName = req.query.channelName;
    if (!channelName) {
        return res.status(400).json({ error: 'channel name is required' });
    }

    const uid = Math.floor(Math.random() * 100000);
    const role = RtcRole.PUBLISHER;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const token = RtcTokenBuilder.buildTokenWithUid(
        appID, appCertificate, channelName, uid, role,
        currentTimestamp + tokenExpirationTimeInSeconds,
        currentTimestamp + privilegeExpirationTimeInSeconds
    );

    res.json({ token, uid });
});

app.listen(port, () => {
    console.log(`Agora token server listening at http://localhost:${port}`);
});
