import type { MouseEvent } from 'react';
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import makeStyles from '@mui/styles/makeStyles';
import useSignal from '../hooks/useSignal';

const useStyles = makeStyles(() => ({
  toolbarButtons: {
    // Add any styling you need here
  },
}));

interface ReactionsButtonProps {
  room: any;
}

export const ReactionsButton: React.FC<ReactionsButtonProps> = ({ room }) => {
  const ITEM_HEIGHT = 48;
  const { sendSignal } = useSignal({ room });
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Add reaction">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          className={classes.toolbarButtons}
          onClick={handleClick}
        >
          <EmojiEmotionsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '10ch',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            sendSignal('thumbsup', 'emoji');
            handleClose();
          }}
        >
          <Typography variant="inherit">
            <ThumbUpAltIcon />
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            sendSignal('thumbsdown', 'emoji');
            handleClose();
          }}
        >
          <Typography variant="inherit">
            <ThumbDownAltIcon />
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            sendSignal('love', 'emoji');
            handleClose();
          }}
        >
          <Typography variant="inherit">
            <FavoriteIcon />
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};
