// PreJoinComponent.jsx
import React, { useMemo } from 'react';
import { PreJoin } from '@livekit/components-react';

export default function PreJoinComponent({ onSubmit }) {
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
