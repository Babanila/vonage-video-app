import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

interface MuteAllButtonProps {
  handleMuteAll: () => void;
  areAllMuted: boolean;
  classes: {
    toolbarButtons: string;
  };
}

export const MuteAllButton: React.FC<MuteAllButtonProps> = ({
  handleMuteAll,
  areAllMuted,
  classes,
}) => {
  const title = areAllMuted ? 'Unmute Participants' : 'Mute Participants';
  return (
    <Tooltip title={title} aria-label='add'>
      <IconButton
        edge='start'
        color='inherit'
        aria-label='videoCamera'
        onClick={handleMuteAll}
        className={classes.toolbarButtons}
      >
        {areAllMuted ? (
          <RecordVoiceOverIcon fontSize='inherit' />
        ) : (
          <VoiceOverOffIcon fontSize='inherit' />
        )}
      </IconButton>
    </Tooltip>
  );
};
