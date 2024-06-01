import type { MouseEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  ButtonGroup,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import useDevices from '../hooks/useDevices';
import styles from './styles';

interface MuteVideoButtonProps {
  classes: any;
  hasVideo: boolean;
  toggleVideo: () => void;
  getVideoSource: () => MediaDeviceInfo | null;
  cameraPublishing: boolean;
  changeVideoSource: (videoDeviceId: string) => void;
}

export const MuteVideoButton: React.FC<MuteVideoButtonProps> = ({
  classes,
  hasVideo,
  toggleVideo,
  getVideoSource,
  cameraPublishing,
  changeVideoSource,
}) => {
  const title = hasVideo ? 'Disable Camera' : 'Enable Camera';
  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = useState<
    MediaDeviceInfo[] | null
  >(null);
  const [options, setOptions] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const localClasses = styles();

  useEffect(() => {
    setDevicesAvailable(deviceInfo.videoInputDevices);

    if (cameraPublishing && devicesAvailable) {
      const currentDeviceId = getVideoSource()?.deviceId;

      const indexOfSelectedElement = devicesAvailable.findIndex(
        (e) => e.deviceId === currentDeviceId,
      );
      setSelectedIndex(indexOfSelectedElement);
    }
  }, [cameraPublishing, getVideoSource, deviceInfo, devicesAvailable]);

  useEffect(() => {
    if (devicesAvailable) {
      const videoDevicesAvailable = devicesAvailable.map((e) => e.label);
      setOptions(videoDevicesAvailable);
    }
  }, [devicesAvailable]);

  const handleChangeVideoSource = (
    event: MouseEvent<HTMLLIElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    const videoDeviceId = devicesAvailable?.find(
      (device) => device.label === event.currentTarget.textContent,
    )?.deviceId;
    if (videoDeviceId) {
      changeVideoSource(videoDeviceId);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef?.current?.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const isVideoPresent: string = !hasVideo ? classes.disabledButton : '';

  return (
    <>
      <ButtonGroup
        className={classes.groupButton}
        disableElevation
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Tooltip title={title} aria-label="add">
          <IconButton
            onClick={toggleVideo}
            edge="start"
            aria-label="videoCamera"
            size="small"
            className={`${classes.arrowButton as string} ${isVideoPresent}`}
          >
            {!hasVideo ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        </Tooltip>
        <IconButton
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          className={classes.arrowButton}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 101 }} // temporary fix for a bug in MP 0.1.5
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleChangeVideoSource(event, index)}
                      classes={{
                        selected: localClasses.selectedMVB,
                        root: localClasses.root,
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
