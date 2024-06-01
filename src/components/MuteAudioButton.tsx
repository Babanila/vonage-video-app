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
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useDevices from '../hooks/useDevices';
import styles from './styles';

interface MuteAudioButtonProps {
  toggleAudio: () => void;
  hasAudio: boolean;
  classes: any;
  getAudioSource: () => Promise<string>;
  cameraPublishing: boolean;
  changeAudioSource: (audioDeviceId: string) => void;
}

export const MuteAudioButton: React.FC<MuteAudioButtonProps> = ({
  toggleAudio,
  hasAudio,
  classes,
  getAudioSource,
  cameraPublishing,
  changeAudioSource,
}) => {
  const title = hasAudio ? 'Disable Microphone' : 'Enable Microphone';
  const localClasses = styles();
  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = useState<
    MediaDeviceInfo[] | null
  >(null);
  const [options, setOptions] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [audioDeviceId, setAudioDeviceId] = useState<string>('');

  useEffect(async () => {
    setDevicesAvailable(deviceInfo.audioInputDevices);

    if (cameraPublishing && devicesAvailable) {
      await getAudioSource().then((id) => setAudioDeviceId(id));

      const indexOfSelectedElement = devicesAvailable.findIndex(
        (e) => e.deviceId === audioDeviceId,
      );
      setSelectedIndex(indexOfSelectedElement);
    }
  }, [
    cameraPublishing,
    getAudioSource,
    deviceInfo,
    audioDeviceId,
    devicesAvailable,
  ]);

  useEffect(() => {
    if (devicesAvailable) {
      const audioDevicesAvailable = devicesAvailable.map((e) => e.label);
      setOptions(audioDevicesAvailable);
    }
  }, [devicesAvailable]);

  const handleChangeAudioSource = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    const audioDeviceId = devicesAvailable?.find(
      (device) => device.label === event.currentTarget.textContent,
    )?.deviceId;
    if (audioDeviceId) {
      changeAudioSource(audioDeviceId);
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

  const isAudioPresent: string = !hasAudio ? classes.disabledButton : '';

  return (
    <>
      <ButtonGroup
        disableElevation
        className={classes.groupButton}
        variant='contained'
        ref={anchorRef}
        aria-label='split button'
      >
        <Tooltip title={title} aria-label='add'>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='mic'
            onClick={toggleAudio}
            className={`${classes.arrowButton as string} ${isAudioPresent}`}
          >
            {!hasAudio ? (
              <MicOffIcon fontSize='inherit' />
            ) : (
              <MicIcon fontSize='inherit' />
            )}
          </IconButton>
        </Tooltip>
        <IconButton
          size='small'
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label='select merge strategy'
          aria-haspopup='menu'
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
                <MenuList id='split-button-menu'>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleChangeAudioSource(event, index)}
                      classes={{ selected: localClasses.selectedMAB }}
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
