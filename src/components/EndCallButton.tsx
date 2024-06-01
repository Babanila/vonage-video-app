import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface EndCallIconProps {
  classes: {
    toolbarButtons: string;
  };
  handleEndCall: () => void;
}

export const EndCallButton: React.FC<EndCallIconProps> = ({
  classes,
  handleEndCall,
}) => {
  return (
    <Tooltip title="End call" aria-label="add">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="videoCamera"
        className={classes.toolbarButtons}
        style={{ backgroundColor: '#D50F2C' }}
        onClick={handleEndCall}
      >
        <ExitToAppIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};
