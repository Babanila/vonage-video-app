import type { FC } from 'react';
import React from 'react';
import MicIcon from '@mui/icons-material/Mic';
import Switch from '@mui/material/Switch';

interface AudioSettingsProps {
  hasAudio: boolean | undefined;
  onAudioChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  className?: string;
}

export const AudioSettings: FC<AudioSettingsProps> = ({
  hasAudio,
  onAudioChange,
  className,
}) => {
  return (
    <div className={className}>
      <MicIcon />
      <div>Microphone</div>
      <Switch checked={hasAudio} onChange={onAudioChange} name="AudioToggle" />
    </div>
  );
};
