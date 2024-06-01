import type { MouseEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import SpeakerIcon from '@mui/icons-material/Speaker';
import type { AudioOutputDevice } from '../hooks/useDevices';
import useDevices from '../hooks/useDevices';
import styles from './styles';

interface SpeakerSelectorProps {
  classes: any;
  cameraPublishing: boolean;
  changeAudioOutput: (audioOutputId: string) => void;
  getCurrentAudioOutput: () => Promise<string | null | undefined>;
}

export const SpeakerSelector: React.FC<SpeakerSelectorProps> = ({
  classes,
  cameraPublishing,
  changeAudioOutput,
  getCurrentAudioOutput,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const localClasses = styles();
  const ITEM_HEIGHT = 48;

  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = useState<
    AudioOutputDevice[] | null
  >(null);
  const [options, setOptions] = useState<Array<string | null>>([]);

  const open = Boolean(anchorEl);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [audioOutputId, setAudioOutputId] = useState<string | null | undefined>(
    '',
  );

  useEffect(() => {
    setDevicesAvailable(deviceInfo.audioOutputDevices);

    if (cameraPublishing && devicesAvailable) {
      (async () => {
        void (await getCurrentAudioOutput().then((id) => setAudioOutputId(id)));
      })();

      const indexOfSelectedElement = devicesAvailable.findIndex(
        (e) => e.deviceId === audioOutputId,
      );

      setSelectedIndex(indexOfSelectedElement);
    }
  }, [
    cameraPublishing,
    deviceInfo,
    audioOutputId,
    devicesAvailable,
    getCurrentAudioOutput,
  ]);

  useEffect(() => {
    if (devicesAvailable) {
      const audioOutputsAvailable = devicesAvailable.map((e) => e.label);
      setOptions(audioOutputsAvailable);
    }
  }, [devicesAvailable]);

  const handleChangeAudioOutput = (
    event: MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    const audioOutputId = devicesAvailable?.find(
      (device) => device.label === event.currentTarget.textContent,
    )?.deviceId;
    if (audioOutputId) {
      changeAudioOutput(audioOutputId);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <Tooltip title="Change Audio Output">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          className={classes.toolbarButtons}
          onClick={handleClick}
        >
          <SpeakerIcon />
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
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleChangeAudioOutput(event, index)}
            classes={{ selected: localClasses.selectedSS }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
