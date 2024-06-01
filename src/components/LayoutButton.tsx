import { useState } from 'react';
import type { MouseEvent } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import styles from './styles';

const ITEM_HEIGHT = 48;

interface LayoutButtonProps {
  classes: {
    toolbarButtons: string;
  };
  room: {
    setLayoutMode: (mode: string) => void;
  } | null;
}

export const LayoutButton: React.FC<LayoutButtonProps> = ({
  classes,
  room,
}) => {
  const localClasses = styles();
  const [layOut, setLayOut] = useState<'grid' | 'active-speaker'>('grid');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLayOutChange = () => {
    if (room) {
      if (layOut === 'grid') {
        room.setLayoutMode('active-speaker');
        setLayOut('active-speaker');
      } else {
        room.setLayoutMode('grid');
        setLayOut('grid');
      }
    }
    handleClose();
  };

  return (
    <div>
      <Tooltip title="Change Layout">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          className={classes.toolbarButtons}
          onClick={handleClick}
        >
          <DashboardIcon />
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
            width: '40ch',
          },
        }}
      >
        <MenuItem
          className={layOut === 'grid' ? localClasses.choosen : undefined}
          onClick={handleLayOutChange}
        >
          <Typography variant="inherit">Grid</Typography>
        </MenuItem>
        <MenuItem
          className={
            layOut === 'active-speaker' ? localClasses.choosen : undefined
          }
          onClick={handleLayOutChange}
        >
          <Typography variant="inherit">Active Speaker</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};
