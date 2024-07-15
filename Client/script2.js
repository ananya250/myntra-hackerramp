const APP_ID = '3d607c3ea1ec43d1a535993e0fc5d5f1'; // Replace with your Agora App ID

let client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = {
    videoTrack: null,
    audioTrack: null
};

let remoteUsers = {};
let remoteAudioTrack = null;

let screenTrack = null;
let isJoined = false;
let isSharingScreen = false;

const urlParams = new URLSearchParams(window.location.search);
const channel = urlParams.get('channel');

document.getElementById('generate-link-btn').onclick = () => {
    const channel = document.getElementById('channel').value;
    if (channel) {
        const joinLink = `${window.location.origin}${window.location.pathname}?channel=${channel}`;
        document.getElementById('join-link').href = joinLink;
        document.getElementById('join-link').innerText = joinLink;
        document.getElementById('link-section').classList.remove('hidden');
    } else {
        showToast('Please enter a channel name.');
    }
};

document.getElementById('join-btn').onclick = async () => {
    const channel = document.getElementById('channel').value;
    if (channel) {
        await joinCall(channel);
    } else {
        showToast('Please enter a channel name.');
    }
};

document.getElementById('leave-btn').onclick = async () => {
    await leaveCall();
};

document.getElementById('share-screen-btn').onclick = async () => {
    if (!isJoined) {
        showToast('You must join the call first.');
        return;
    }
    if (!isSharingScreen) {
        await startScreenSharing();
    } else {
        await stopScreenSharing();
    }
};

async function joinCall(channel) {
    try {
        const response = await fetch(`http://localhost:3000/rtcToken?channelName=${channel}`);
        const data = await response.json();
        const token = data.token;
        const uid = data.uid;

        const joinedUid = await client.join(APP_ID, channel, token, uid);
        console.log('User ' + joinedUid + ' join channel successfully');
        isJoined = true;

        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();

        console.log('Local tracks created:', localTracks);

        localTracks.videoTrack.play('local-player');

        await client.publish(Object.values(localTracks));
        console.log('Local tracks published:', localTracks);

        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);

        // Network quality monitoring
        client.on("network-quality", (stats) => {
            console.log("Downlink network quality:", stats.downlinkNetworkQuality);
            console.log("Uplink network quality:", stats.uplinkNetworkQuality);
        });

        await populateAudioOutputSelect();
    } catch (error) {
        console.error('Error joining call:', error);
        showToast('Failed to join the call. Please check console for details.');
    }
}


async function leaveCall() {
    for (let trackName in localTracks) {
        let track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = null;
        }
    }

    if (screenTrack) {
        screenTrack.stop();
        screenTrack.close();
        screenTrack = null;
    }

    remoteAudioTrack = null;

    await client.leave();
    console.log('Client left the channel');
    isJoined = false;
    isSharingScreen = false;

    document.getElementById('local-player').innerHTML = '';
    document.getElementById('remote-player').innerHTML = '';
    document.getElementById('share-screen-btn').innerText = 'Share Screen';
    document.getElementById('channel').value = "";
    // Hide the link section and clear the join link
    document.getElementById('link-section').classList.add('hidden');
    document.getElementById('join-link').href = '#';
    document.getElementById('join-link').innerText = '';
}

async function handleUserPublished(user, mediaType) {
    await client.subscribe(user, mediaType);
    console.log('Subscribed to', mediaType, 'of user', user.uid);

    if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play('remote-player');
    }

    if (mediaType === 'audio') {
        remoteAudioTrack = user.audioTrack;
        console.log('Remote audio track received:', remoteAudioTrack);
        remoteAudioTrack.play();
        console.log('Remote audio track played');
    }
}



function handleUserUnpublished(user) {
    const remoteVideoTrack = user.videoTrack;
    if (remoteVideoTrack) {
        remoteVideoTrack.stop();
    }
    if (user.audioTrack === remoteAudioTrack) {
        remoteAudioTrack = null;
    }
}

async function startScreenSharing() {
    screenTrack = await AgoraRTC.createScreenVideoTrack();
    await client.unpublish(localTracks.videoTrack);
    await client.publish(screenTrack);
    screenTrack.play('local-player');

    screenTrack.on('track-ended', async () => {
        await stopScreenSharing();
    });

    isSharingScreen = true;
    document.getElementById('share-screen-btn').innerText = 'Stop Screen Sharing';
}

async function stopScreenSharing() {
    await client.unpublish(screenTrack);
    screenTrack.stop();
    screenTrack.close();
    screenTrack = null;

    await client.publish(localTracks.videoTrack);
    localTracks.videoTrack.play('local-player');

    isSharingScreen = false;
    document.getElementById('share-screen-btn').innerText = 'Share Screen';
}

async function populateAudioOutputSelect() {
    const select = document.getElementById('audioOutput');
    select.innerHTML = ''; // Clear existing options
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
    audioOutputDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Output ${select.length + 1}`;
        select.appendChild(option);
    });
}

document.getElementById('audioOutput').onchange = async (e) => {
    const deviceId = e.target.value;
    try {
        if (remoteAudioTrack && typeof remoteAudioTrack.setAudioOutput === 'function') {
            await remoteAudioTrack.setAudioOutput(deviceId);
            console.log('Audio output device set to:', deviceId);
        } else {
            console.warn('setAudioOutput is not supported or no remote audio track available');
            // Fallback: you might need to re-create the audio track with the new device
        }
    } catch (error) {
        console.error('Error setting audio output:', error);
    }
};

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Automatically join the call if the channel is provided in the URL
if (channel) {
    document.getElementById('channel').value = channel;
    document.getElementById('join-btn').click();
}
