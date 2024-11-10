// SettingsMenu.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Track } from 'livekit-client';
import { MediaDeviceMenu, TrackToggle, useRoomContext, useIsRecording } from '@livekit/components-react';
import { useKrispNoiseFilter } from '@livekit/components-react/krisp';

export default function SettingsMenu() {
  const room = useRoomContext();
  const recordingEndpoint = process.env.REACT_APP_LK_RECORD_ENDPOINT || '';

  const settings = useMemo(() => ({
    media: { camera: true, microphone: true, label: 'Media Devices', speaker: true },
    effects: { label: 'Effects' },
    recording: recordingEndpoint ? { label: 'Recording' } : undefined,
  }), [recordingEndpoint]);

  const tabs = useMemo(() => Object.keys(settings).filter((tab) => settings[tab] !== undefined), [settings]);
  
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const { isNoiseFilterEnabled, setNoiseFilterEnabled, isNoiseFilterPending } = useKrispNoiseFilter();

  useEffect(() => {
    setNoiseFilterEnabled(true);
  }, [setNoiseFilterEnabled]);

  const isRecording = useIsRecording();
  const [initialRecStatus, setInitialRecStatus] = useState(isRecording);
  const [processingRecRequest, setProcessingRecRequest] = useState(false);

  useEffect(() => {
    if (initialRecStatus !== isRecording) {
      setProcessingRecRequest(false);
    }
  }, [isRecording, initialRecStatus]);

  const toggleRoomRecording = async () => {
    if (!recordingEndpoint) {
      throw new TypeError('No recording endpoint specified');
    }
    if (room.isE2EEEnabled) {
      throw new Error('Recording of encrypted meetings is currently not supported');
    }
    setProcessingRecRequest(true);
    setInitialRecStatus(isRecording);

    try {
      const response = isRecording
        ? await fetch(`${recordingEndpoint}/stop?roomName=${room.name}`)
        : await fetch(`${recordingEndpoint}/start?roomName=${room.name}`);

      if (!response.ok) {
        console.error('Error handling recording request, check server logs:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during recording request:', error);
    } finally {
      setProcessingRecRequest(false);
    }
  };

  return (
    <div className="w-full p-4 relative">
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          settings[tab] && (
            <button
              key={tab}
              className={`px-4 py-2 border-b-4 ${tab === activeTab ? 'border-blue-500' : 'border-transparent'} focus:outline-none`}
              onClick={() => setActiveTab(tab)}
              aria-pressed={tab === activeTab}
            >
              {settings[tab].label}
            </button>
          )
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'media' && (
          <>
            {settings.media?.camera && (
              <>
                <h3 className="mb-2">Camera</h3>
                <section className="flex items-center space-x-4 mb-4">
                  <TrackToggle source={Track.Source.Camera}>Camera</TrackToggle>
                  <MediaDeviceMenu kind="videoinput" />
                </section>
              </>
            )}
            {settings.media?.microphone && (
              <>
                <h3 className="mb-2">Microphone</h3>
                <section className="flex items-center space-x-4 mb-4">
                  <TrackToggle source={Track.Source.Microphone}>Microphone</TrackToggle>
                  <MediaDeviceMenu kind="audioinput" />
                </section>
              </>
            )}
            {settings.media?.speaker && (
              <>
                <h3 className="mb-2">Speaker & Headphones</h3>
                <section className="flex items-center space-x-4 mb-4">
                  <span>Audio Output</span>
                  <MediaDeviceMenu kind="audiooutput" />
                </section>
              </>
            )}
          </>
        )}
        {activeTab === 'effects' && (
          <>
            <h3 className="mb-2">Audio</h3>
            <section className="flex items-center space-x-2 mb-4">
              <label htmlFor="noise-filter">Enhanced Noise Cancellation</label>
              <input
                type="checkbox"
                id="noise-filter"
                onChange={(ev) => setNoiseFilterEnabled(ev.target.checked)}
                checked={isNoiseFilterEnabled}
                disabled={isNoiseFilterPending}
                className="form-checkbox"
              />
            </section>
          </>
        )}
        {activeTab === 'recording' && (
          <>
            <h3 className="mb-2">Record Meeting</h3>
            <section>
              <p className="mb-4">
                {isRecording
                  ? 'Meeting is currently being recorded'
                  : 'No active recordings for this meeting'}
              </p>
              <button
                disabled={processingRecRequest}
                onClick={toggleRoomRecording}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isRecording ? 'Stop' : 'Start'} Recording
              </button>
            </section>
          </>
        )}
      </div>

      {/* Close button */}
      <button
        className="absolute right-4 bottom-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={() => console.log('Close Settings')}
      >
        Close
      </button>
    </div>
  );
}
