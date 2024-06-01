import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';

interface ScreenSharingButtonProps {
  classes: {
    toolbarButtons: string;
    activeButton: string;
  };
  isScreenSharing: boolean;
  startScreenSharing: () => void;
  stopScreenSharing: () => void;
}

export const ScreenSharingButton: React.FC<ScreenSharingButtonProps> = ({
  classes,
  isScreenSharing,
  startScreenSharing,
  stopScreenSharing,
}) => {
  const handleScreenSharing = () => {
    isScreenSharing ? stopScreenSharing() : startScreenSharing();
  };

  const title = isScreenSharing ? 'Stop Screensharing' : 'Start Screensharing';

  return (
    <Tooltip title={title} aria-label="add">
      <IconButton
        // variant='primary'
        edge="start"
        color="inherit"
        aria-label="screen sharing"
        onClick={handleScreenSharing}
        className={`${classes.toolbarButtons} ${
          isScreenSharing ? classes.activeButton : ''
        }`}
      >
        {isScreenSharing ? (
          <StopScreenShareIcon fontSize="inherit" />
        ) : (
          <ScreenShareIcon fontSize="inherit" />
        )}
      </IconButton>
    </Tooltip>
  );
};
