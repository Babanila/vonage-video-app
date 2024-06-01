import React from 'react';
import VideocamIcon from '@mui/icons-material/Videocam';
import Switch from '@mui/material/Switch';

interface VideoSettingsProps {
  hasVideo: boolean | undefined;
  onVideoChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  className: string;
}

const VideoSettingsDefault: React.FC<VideoSettingsProps> = ({
  hasVideo,
  onVideoChange,
  className,
}) => {
  return (
    <div className={className}>
      <VideocamIcon />
      <div>Video</div>
      <Switch checked={hasVideo} onChange={onVideoChange} name='VideoToggle' />
    </div>
  );
};

export const VideoSettings = React.memo(VideoSettingsDefault);
