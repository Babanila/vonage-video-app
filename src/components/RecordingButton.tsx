import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import makeStyles from '@mui/styles/makeStyles';
import { startRecording, stopRecording } from '../api';

interface RecordingButtonProps {
  classes: {
    toolbarButtons: string;
  };
  room: {
    roomId: string;
  };
}

const useStyles = makeStyles({
  activeRecordingIcon: {
    color: '#D50F2C',
  },
});

export const RecordingButton: React.FC<RecordingButtonProps> = ({
  classes,
  room,
}) => {
  const [isRecording, setRecording] = useState(false);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const localClasses = useStyles();

  const handleRecordingStart = async (sessionId: string) => {
    try {
      const data = await startRecording(sessionId);
      if (data.status === 200 && data.data) {
        const { archiveId } = data.data;
        setArchiveId(archiveId);
        setRecording(true);
      }
    } catch (e) {
      setRecording(false);
      console.error(e);
    }
  };

  const handleRecordingStop = async (archiveId: string) => {
    try {
      if (isRecording) {
        const data = await stopRecording(archiveId);
        if (data.status === 200 && data.data) {
          setRecording(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordingAction = async () => {
    if (room) {
      const sessionId = room.roomId;

      if (isRecording && archiveId) {
        await handleRecordingStop(archiveId);
      } else {
        await handleRecordingStart(sessionId);
      }
    }
  };

  const title = isRecording ? 'Stop Recording' : 'Start Recording';

  return (
    <Tooltip title={title} aria-label='add'>
      <IconButton
        edge='start'
        color='inherit'
        aria-label='mic'
        onClick={() => handleRecordingAction}
        className={classes.toolbarButtons}
      >
        <FiberManualRecordIcon
          fontSize='inherit'
          className={isRecording ? localClasses.activeRecordingIcon : undefined}
        />
      </IconButton>
    </Tooltip>
  );
};
