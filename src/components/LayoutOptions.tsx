import React from 'react';
import { withStyles } from '@mui/styles';
import type { Theme } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';

interface LayoutOptionsProps {
  handleLayOutChange: (layout: string) => void;
  open: boolean;
  handleCloseLayout: () => void;
  anchorElLayout: null | HTMLElement;
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: any) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme: Theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export const LayoutOptions: React.FC<LayoutOptionsProps> = ({
  handleLayOutChange,
  open,
  handleCloseLayout,
  anchorElLayout,
}) => {
  return (
    <div>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorElLayout}
        keepMounted
        open={open}
        onClose={handleCloseLayout}
      >
        <StyledMenuItem
          onClick={() => {
            handleLayOutChange('grid');
          }}
        >
          Grid
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            handleLayOutChange('active-speaker');
          }}
        >
          Active Speaker
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};
