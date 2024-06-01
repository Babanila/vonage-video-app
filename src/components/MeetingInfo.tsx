import React, { useState } from 'react';
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly.js';
import FileCopyIcon from '@mui/icons-material/FileCopy.js';
import MoreIcon from '@mui/icons-material/More.js';
import HouseIcon from '@mui/icons-material/House.js';
import QRCode from 'qrcode.react';

import useCopyMeetingUrl from '../hooks/useCopyMeetingUrl.js';

import styles from './styles.js';

interface MeetingInfoProps {
  roomId: string;
}

export const MeetingInfo: React.FC<MeetingInfoProps> = ({ roomId }) => {
  const { copyUrl } = useCopyMeetingUrl();
  const [title, setTitle] = useState('Copy');

  const ListItemLink: React.FC<React.ComponentProps<typeof ListItem>> = (
    props,
  ) => {
    return <ListItem component='a' {...props} button={true} />;
  };

  const handleClick = () => {
    setTitle('Copied');
    copyUrl();
  };

  const handleClose = () => {
    setTimeout(() => {
      setTitle('Copy');
    }, 500);
  };

  const localClasses = styles();

  return (
    <List className={localClasses.list}>
      <div className={localClasses.containerMI}>
        <Typography className={localClasses.header} variant='h5'>
          Joining info
        </Typography>
        <ListItem>{window.location.href}</ListItem>
        <Tooltip title={title} onClose={handleClose} aria-label='add'>
          <Button
            onClick={handleClick}
            variant='contained'
            color='primary'
            className={localClasses.buttonMI}
            endIcon={<FileCopyIcon>send</FileCopyIcon>}
          >
            Copy URL
          </Button>
        </Tooltip>
        <ListItem>
          <QRCode
            className={localClasses.qrCode}
            value={window.location.href}
          />
        </ListItem>

        <Divider />
        <Typography className={localClasses.header} variant='h5'>
          App info
        </Typography>
        <ListItem>
          <ListItemIcon>
            <MoreIcon variant='contained' color='primary' />
          </ListItemIcon>
          <ListItemText
            className={localClasses.versionLabel}
            // primary={`Version ` + process.env.REACT_APP_VERSION}
          />
        </ListItem>
        <ListItem className={localClasses.listItem}>
          <ListItemIcon>
            <HouseIcon variant='contained' color='primary' />
          </ListItemIcon>
          <ListItemLink
            href='https://github.com/nexmo-se/video-api-multiparty-sdk-sample-app'
            target='_blank'
          >
            <ListItemText primary='Source code' />
          </ListItemLink>
        </ListItem>
        <ListItem className={localClasses.listItem}>
          <ListItemIcon>
            <ChildFriendlyIcon
              // variant='contained'
              color='primary'
            />
          </ListItemIcon>
          <ListItemLink
            href='https://www.npmjs.com/package/@vonage/video-express'
            target='_blank'
          >
            <ListItemText primary='Video Express' />
          </ListItemLink>
        </ListItem>
        <Divider />
        <Typography className={localClasses.header} variant='h5'>
          Session info
        </Typography>

        <ListItem>
          <ListItemText
            className={localClasses.sessionLabel}
            secondary={`Session Id: ` + roomId}
          />
        </ListItem>
      </div>
    </List>
  );
};
