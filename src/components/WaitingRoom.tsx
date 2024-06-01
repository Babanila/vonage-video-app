import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { RouteComponentProps } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as VideoExpress from '@vonage/video-express';
import { useUserContext } from '../context/userContext';
import { DEVICE_ACCESS_STATUS } from '../utils';
import { usePreviewPublisher } from '../hooks/usePreviewPublisher';
import type { AudioOutputDevice } from '../hooks/useDevices';
import { AudioSettings } from './AudioSettings';
import { DeviceAccessAlert } from './DeviceAccessAlert';
import { VideoSettings } from './VideoSettings';
import { VideoFilter } from './VideoFilter';
import useStyles from './styles';

interface WaitingRoomProps extends RouteComponentProps {}

export const WaitingRoom: React.FC<WaitingRoomProps> = () => {
  const classes = useStyles();
  const { push } = useHistory();
  const { user, setUser } = useUserContext();
  const waitingRoomVideoContainer = useRef<HTMLDivElement | null>(null);

  const [roomName, setRoomName] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [isRoomNameInvalid, setIsRoomNameInvalid] = useState(false);
  const [isUserNameInvalid, setIsUserNameInvalid] = useState(false);
  const [localAudio, setLocalAudio] = useState(
    user?.defaultSettings.publishAudio,
  );
  const [localVideo, setLocalVideo] = useState(
    user?.defaultSettings.publishVideo,
  );
  const [localVideoSource, setLocalVideoSource] = useState<string | undefined>(
    undefined,
  );
  const [localAudioSource, setLocalAudioSource] = useState<string | undefined>(
    undefined,
  );
  const [localAudioOutput, setLocalAudioOutput] = useState<string | undefined>(
    undefined,
  );
  const [audioDevice, setAudioDevice] = useState<string>('');
  const [videoDevice, setVideoDevice] = useState<string>('');
  const [audioOutputDevice, setAudioOutputDevice] = useState<
    string | undefined
  >('');
  const [videoFilter, setVideoFilter] = useState({
    filterName: '',
    filterPayload: '',
  });

  const {
    createPreview,
    destroyPreview,
    previewPublisher,
    logLevel,
    previewMediaCreated,
    deviceInfo,
    accessAllowed,
  } = usePreviewPublisher();

  const handleVideoSource = useCallback(
    (e: SelectChangeEvent) => {
      const videoDeviceId = e.target.value;

      (async () => {
        await previewPublisher?.setVideoDevice(videoDeviceId);
      })();

      setVideoDevice(videoDeviceId);
      setLocalVideoSource(videoDeviceId);
    },
    [previewPublisher],
  );

  const handleAudioSource = useCallback(
    (e: SelectChangeEvent) => {
      const audioDeviceId = e.target.value;

      (async () => {
        await previewPublisher?.setAudioDevice(audioDeviceId);
      })();

      setAudioDevice(audioDeviceId);
      setLocalAudioSource(audioDeviceId);
    },
    [previewPublisher],
  );

  const handleAudioOutput = useCallback((e: SelectChangeEvent) => {
    const audioOutputId = e.target.value;
    setAudioOutputDevice(audioOutputId);
    setLocalAudioOutput(audioOutputId);
  }, []);

  const redirectHttps = useCallback(() => {
    const url = window.location.href;
    if (url.startsWith('http://') && !url.startsWith('http://localhost')) {
      window.location.href = url.replace('http://', 'https://');
    }
  }, []);

  const handleJoinClick = () => {
    if (validateForm()) {
      localStorage.setItem('username', userName);
      push(`room/${roomName}`);
    }
  };

  const validateForm = () => {
    if (!userName) {
      setIsUserNameInvalid(true);

      return false;
    }
    if (!roomName) {
      setIsRoomNameInvalid(true);

      return false;
    }
    return true;
  };

  const onChangeRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const roomName = e.target.value.trim();
    setRoomName(roomName);
    setIsRoomNameInvalid(!roomName);
  };

  const onChangeParticipantName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userName = e.target.value.trim();
    setUserName(userName);
    setIsUserNameInvalid(!userName);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinClick();
    }
  };

  const handleAudioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalAudio(e.target.checked);
    },
    [],
  );

  const handleVideoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalVideo(e.target.checked);
    },
    [],
  );

  const handleChangeVideoFilter = useCallback(
    async (filter: string, filterPayload: any) => {
      if (previewPublisher && filter) {
        switch (filter) {
          case 'reset':
            await previewPublisher.clearVideoFilter();
            setVideoFilter({ filterName: '', filterPayload: '' });
            break;
          case 'blur':
            await previewPublisher.setVideoFilter({
              type: 'backgroundBlur',
              blurStrength: filterPayload,
            });
            setVideoFilter({ filterName: filter, filterPayload });
            break;
          case 'backgroundImage':
            await previewPublisher.setVideoFilter({
              type: 'backgroundReplacement',
              backgroundImgUrl: filterPayload,
            });
            setVideoFilter({ filterName: filter, filterPayload });
            break;
          default:
          // do nothing
        }
      }
    },
    [previewPublisher],
  );

  useEffect(() => {
    redirectHttps();
    const savedUserName = localStorage.getItem('username');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, [redirectHttps]);

  useEffect(() => {
    if (
      user &&
      (localAudio !== user?.defaultSettings.publishAudio ||
        localVideo !== user?.defaultSettings.publishVideo ||
        localAudioSource !== user?.defaultSettings.audioSource ||
        localVideoSource !== user?.defaultSettings.videoSource ||
        videoFilter.filterName !== user?.videoFilter.filterName ||
        videoFilter.filterPayload !== user?.videoFilter.filterPayload ||
        localAudioOutput !== user?.defaultSettings.audioOutput)
    ) {
      setUser({
        ...user,
        videoFilter: {
          filterName: videoFilter?.filterName,
          filterPayload: videoFilter?.filterPayload,
        },
        defaultSettings: {
          publishAudio: localAudio,
          publishVideo: localVideo,
          audioSource: localAudioSource,
          videoSource: localVideoSource,
          audioOutput: localAudioOutput,
        },
      });
    }
  }, [
    localAudio,
    localVideo,
    user,
    setUser,
    localAudioSource,
    localVideoSource,
    videoFilter,
    localAudioOutput,
  ]);

  useEffect(() => {
    if (user && userName !== user?.userName) {
      setUser({ ...user, userName });
    }
  }, [userName, user, setUser]);

  useEffect(() => {
    (async () => {
      if (previewPublisher && previewMediaCreated && deviceInfo) {
        await previewPublisher.getAudioDevice().then((currentAudioDevice) => {
          setAudioDevice(currentAudioDevice.deviceId);
        });

        const currentVideoDevice = await previewPublisher.getVideoDevice();
        setVideoDevice(currentVideoDevice.deviceId);

        await VideoExpress.getActiveAudioOutputDevice().then(
          (currentAudioOutputDevice) => {
            setAudioOutputDevice(currentAudioOutputDevice?.deviceId as string);
          },
        );
      }
    })();
  }, [deviceInfo, previewPublisher, previewMediaCreated]);

  useEffect(() => {
    if (previewPublisher) {
      if (localAudio && !previewPublisher.isAudioEnabled()) {
        previewPublisher.enableAudio();
      } else if (!localAudio && previewPublisher.isAudioEnabled()) {
        previewPublisher.disableAudio();
      }
    }
  }, [localAudio, previewPublisher]);

  useEffect(() => {
    if (previewPublisher) {
      previewPublisher.enableVideo();
      if (localVideo && !previewPublisher.isVideoEnabled()) {
        previewPublisher.enableVideo();
      } else if (!localVideo && previewPublisher.isVideoEnabled()) {
        previewPublisher.disableVideo();
      }
    }
  }, [localVideo, previewPublisher]);

  useEffect(() => {
    if (waitingRoomVideoContainer?.current) {
      (async () => {
        await createPreview(waitingRoomVideoContainer.current, {});
      })();
    }
    return () => {
      destroyPreview();
    };
  }, [createPreview, destroyPreview]);

  return (
    <>
      <div className={classes.waitingRoomContainer}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="publisher-name"
              label="Name"
              name="name"
              error={isUserNameInvalid}
              required
              autoComplete="Name"
              helperText={userName === '' ? 'Empty Field' : ' '}
              value={userName}
              onChange={onChangeParticipantName}
              onKeyDown={onKeyDown}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              // disabled={roomName !== ''}
              id="room-name"
              label="Room Name"
              name="roomName"
              autoComplete="Room Name"
              error={isRoomNameInvalid}
              autoFocus
              helperText={roomName === '' ? 'Empty Field' : ' '}
              value={roomName}
              onChange={onChangeRoomName}
              onKeyDown={onKeyDown}
            />
            <div className={classes.mediaSources}>
              {deviceInfo && previewMediaCreated && (
                <>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Select Audio Source
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={audioDevice}
                      onChange={(e: SelectChangeEvent) => handleAudioSource(e)}
                    >
                      {deviceInfo.audioInputDevices.map(
                        (device: AudioOutputDevice) => (
                          <MenuItem
                            key={device.deviceId}
                            value={device?.deviceId ?? ''}
                          >
                            {device.label}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="video">Select Audio Output</InputLabel>
                    {deviceInfo.audioOutputDevices && (
                      <Select
                        labelId="video"
                        id="demo-simple-select"
                        value={audioOutputDevice}
                        onChange={(e: SelectChangeEvent) =>
                          handleAudioOutput(e)
                        }
                      >
                        {deviceInfo.audioOutputDevices.map(
                          (device: AudioOutputDevice) => (
                            <MenuItem
                              key={device.deviceId}
                              value={device?.deviceId ?? ''}
                            >
                              {device.label}
                            </MenuItem>
                          ),
                        )}
                      </Select>
                    )}
                  </FormControl>
                </>
              )}

              {deviceInfo && previewMediaCreated && (
                <FormControl>
                  <InputLabel id="video">Select Video Source</InputLabel>
                  {deviceInfo.videoInputDevices && (
                    <Select
                      labelId="video"
                      id="demo-simple-select"
                      value={videoDevice}
                      onChange={(e: SelectChangeEvent) => handleVideoSource(e)}
                    >
                      {deviceInfo.videoInputDevices.map(
                        (device: AudioOutputDevice) => (
                          <MenuItem
                            key={device.deviceId}
                            value={device?.deviceId ?? ''}
                          >
                            {device.label}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  )}
                </FormControl>
              )}
            </div>
          </form>

          <div
            id="waiting-room-video-container"
            className={classes.waitingRoomVideoPreview}
            ref={waitingRoomVideoContainer}
          ></div>

          <div className={classes.deviceContainer}>
            <AudioSettings
              className={classes.deviceSettings}
              hasAudio={localAudio}
              onAudioChange={handleAudioChange}
            />
            <LinearProgress variant="determinate" value={logLevel} />
            <VideoSettings
              className={classes.deviceSettings}
              hasVideo={localVideo}
              onVideoChange={handleVideoChange}
            />
          </div>

          <VideoFilter
            handleChangeVideoFilter={() => handleChangeVideoFilter}
          />
        </Grid>

        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinClick}
            disabled={!roomName || !userName}
          >
            Join Call
          </Button>
        </Grid>
      </div>
      {accessAllowed !== DEVICE_ACCESS_STATUS.ACCEPTED && (
        <DeviceAccessAlert accessStatus={accessAllowed}></DeviceAccessAlert>
      )}
    </>
  );
};
