// VideoConferenceComponent.jsx
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom, VideoConference, formatChatMessageLinks } from '@livekit/components-react';
import { Room, VideoPresets } from 'livekit-client';
import SettingsMenu from './SettingsMenu';

// Constants
const SHOW_SETTINGS_MENU = 'true';

export default function VideoConferenceComponent({ connectionDetails, userChoices, options }) {
  const navigate = useNavigate();
  
  const hq = options?.hq ?? false;
  const codec = options?.codec ?? 'vp9';

  const roomOptions = useMemo(() => ({
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
  }), [userChoices, hq, codec]);

  const room = useMemo(() => new Room(roomOptions), [roomOptions]);

  const handleOnLeave = useCallback(() => navigate('/'), [navigate]);
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
