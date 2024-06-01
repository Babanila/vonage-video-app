import React, { useState } from 'react';
import { Drawer, IconButton, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import useSignal from '../hooks/useSignal';
import styles from './styles';
import { SideMenu } from './SideMenu';

interface MoreOptionsButtonProps {
  classes: {
    infoButton: string;
    paper: string;
    root: string;
  };
  participants: any[];
  room: any;
  localParticipant: any;
}

export const MoreOptionsButton: React.FC<MoreOptionsButtonProps> = ({
  classes,
  participants,
  room,
  localParticipant,
}) => {
  const { listOfMessages } = useSignal({ room });
  const titleToolTip = 'Chat';
  const localClasses = styles();
  const [state, setState] = useState(false);

  const toggleDrawer =
    () => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState(!state);
    };

  return (
    <div>
      <Tooltip title={titleToolTip} aria-label='add'>
        <IconButton
          onClick={toggleDrawer()}
          edge='start'
          color='inherit'
          aria-label='chat'
          className={localClasses.infoButtonMOB}
        >
          <ChatIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
      <Drawer
        open={state}
        onClose={toggleDrawer()}
        classes={{ paper: localClasses.paperMOB }}
      >
        <SideMenu
          room={room}
          participants={participants}
          localParticipant={localParticipant}
          listOfMessages={listOfMessages}
        />
      </Drawer>
    </div>
  );
};
