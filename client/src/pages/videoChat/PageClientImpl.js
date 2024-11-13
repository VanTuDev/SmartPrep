import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LiveKitRoom,
  PreJoin,
  VideoConference,
  formatChatMessageLinks,
} from '@livekit/components-react';
import { Room, VideoPresets } from 'livekit-client';
import SettingsMenu from './SettingsMenu';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Constants
const CONN_DETAILS_ENDPOINT = '/api/room/join-room';
const SHOW_SETTINGS_MENU = 'true';



export default function PageClientImpl() {
  const { roomName } = useParams();
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [preJoinChoices, setPreJoinChoices] = useState(null); // Initializing as null

  // Handle PreJoin form submission
  const handlePreJoinSubmit = async (values) => {
    setPreJoinChoices(values);
    console.log(roomName, values.username);

    if (roomName && values.username) {
      try {
        const response = await axios.post(`http://localhost:5000${CONN_DETAILS_ENDPOINT}`, {
          roomName: roomName,  // Room code from URL
          userName: values.username,  // Username from the form
        });
        const connectionDetailsData = response.data.data;
        console.log(connectionDetailsData.participantToken);

        // Set connection details after receiving from API
        setConnectionDetails(connectionDetailsData);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    } else {
      alert('Please provide a valid room code and username.');
    }
  };

  return (
    <main data-lk-theme="default" style={{ height: '100%' }}>
      {connectionDetails && preJoinChoices ? (
        <VideoConferenceComponent
          connectionDetails={connectionDetails}
          userChoices={preJoinChoices}
          options={{ hq: true, codec: 'vp9' }} // Provide default options here
        />
      ) : (
        <PreJoinComponent onSubmit={handlePreJoinSubmit} />
      )}
    </main>
  );
}

function PreJoinComponent({ onSubmit }) {
  const preJoinDefaults = useMemo(
    () => ({
      username: '',
      videoEnabled: true,
      audioEnabled: true,
    }),
    []
  );

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <PreJoin defaults={preJoinDefaults} onSubmit={onSubmit} />
    </div>
  );
}

function VideoConferenceComponent({ connectionDetails, userChoices, options }) {
  const navigate = useNavigate();

  // Ensure hq and codec are safely accessed
  const hq = options?.hq ?? false;
  const codec = options?.codec ?? 'vp9';

  const roomOptions = useMemo(() => {
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId,
        resolution: hq ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers: hq
          ? [VideoPresets.h1080, VideoPresets.h720]
          : [VideoPresets.h540, VideoPresets.h216],
        videoCodec: codec,
      },
      audioCaptureDefaults: { deviceId: userChoices.audioDeviceId },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
    };
  }, [userChoices, hq, codec]);
  
  const room = useMemo(() => new Room(roomOptions), [roomOptions]);

  console.log(room);
  const userInfo = jwtDecode(localStorage.getItem('token'))
  console.log(userInfo);
  
  const handleOnLeave = useCallback(() => navigate(`/${userInfo.role}/dashboard`), [navigate]);
  const handleError = useCallback((error) => {
    console.error(error);
    alert(`Unexpected error: ${error.message}`);
  }, []);

  return (
    <LiveKitRoom
      room={room}
      token={connectionDetails.participantToken}
      serverUrl={connectionDetails.serverUrl}
      connectOptions={{ autoSubscribe: true }}
      video={userChoices.videoEnabled}
      audio={userChoices.audioEnabled}
      onDisconnected={handleOnLeave}
      onError={handleError}
    >
      <VideoConference
        chatMessageFormatter={formatChatMessageLinks}
        SettingsComponent={SHOW_SETTINGS_MENU === 'true' ? SettingsMenu : undefined}
      />
    </LiveKitRoom>
  );
}
