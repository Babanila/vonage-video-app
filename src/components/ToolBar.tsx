import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import * as VideoExpress from '@vonage/video-express';
import { EndCallButton } from './EndCallButton';
import { MuteAudioButton } from './MuteAudioButton';
import { MuteVideoButton } from './MuteVideoButton';
import { LayoutButton } from './LayoutButton';
import { MoreOptionsButton } from './MoreOptionsButton';
import { MuteAllButton } from './MuteAllButton';
import { RecordingButton } from './RecordingButton';
import { ReactionsButton } from './ReactionsButton';
import { ScreenSharingButton } from './ScreenSharingButton';
import { SpeakerSelector } from './SpeakerSelector';
import { VideoFilterButton } from './VideoFilterButton';
import styles from './styles';

interface ToolBarProps {
  room: any;
  connected: boolean;
  cameraPublishing: boolean;
  isScreenSharing: boolean;
  startScreenSharing: () => void;
  stopScreenSharing: () => void;
  participants: any[];
  localParticipant: any;
}

interface Params {
  roomName: string;
}

export function ToolBar({
  room,
  connected,
  cameraPublishing,
  isScreenSharing,
  startScreenSharing,
  stopScreenSharing,
  participants,
  localParticipant,
}: ToolBarProps) {
  const { roomName } = useParams<Params>();
  const theme = useTheme();
  const { push } = useHistory();
  const [hasAudio, setHasAudio] = useState<boolean>(true);
  const [hasVideo, setHasVideo] = useState<boolean>(true);
  const [areAllMuted, setAllMuted] = useState<boolean>(false);
  const classes = styles();
  const isMobileWidth = useMediaQuery(theme.breakpoints.down('xs'));

  const handleMuteAll = () => {
    if (!areAllMuted) {
      participants.forEach((participant) => participant.camera.disableAudio());
      setAllMuted(true);
    } else {
      participants.forEach((participant) => participant.camera.enableAudio());
      setAllMuted(false);
    }
  };

  const toggleVideo = () => {
    if (room?.camera) {
      const { camera } = room;
      const isVideoEnabled = camera.isVideoEnabled();

      if (isVideoEnabled) {
        camera.disableVideo();
        setHasVideo(false);
      } else {
        camera.enableVideo();
        setHasVideo(true);
      }
    }
  };

  const toggleAudio = () => {
    if (room?.camera) {
      const camera = room.camera;
      const isAudioEnabled = camera.isAudioEnabled();

      if (isAudioEnabled) {
        camera.disableAudio();
        setHasAudio(false);
      } else {
        camera.enableAudio();
        setHasAudio(true);
      }
    }
  };

  const getVideoSource = () => {
    if (room?.camera) {
      return room.camera.getVideoDevice();
    }
  };

  const changeVideoSource = (videoId: string) => {
    room.camera.setVideoDevice(videoId);
  };

  const changeAudioSource = (audioId: string) => {
    room.camera.setAudioDevice(audioId);
  };

  const changeAudioOutput = async (audioOutputDeviceId: string) => {
    void (await VideoExpress.setAudioOutputDevice(audioOutputDeviceId));
  };

  const getCurrentAudioOutput = async (): Promise<
    string | null | undefined
  > => {
    try {
      const currentAudioOutput =
        await VideoExpress.getActiveAudioOutputDevice();

      return currentAudioOutput.deviceId;
    } catch (e) {
      console.error(e);

      return '';
    }
  };

  const getAudioSource = async () => {
    if (room?.camera) {
      const audioDevice = await room.camera.getAudioDevice();
      return audioDevice.deviceId;
    }
  };

  const endCall = () => {
    if (room) {
      push(`/${roomName}/${room.roomId as string}/end`);
      room.leave();
    }
  };

  useEffect(() => {
    if (connected) {
      const isAudioEnabled = room?.camera?.isAudioEnabled();
      const isVideoEnabled = room?.camera?.isVideoEnabled();
      setHasAudio(!!isAudioEnabled);
      setHasVideo(!!isVideoEnabled);
    }
  }, [connected, room]);

  return isMobileWidth ? (
    <div className={classes.toolbarMobileContainer}>
      <MuteAudioButton
        toggleAudio={toggleAudio}
        hasAudio={hasAudio}
        classes={classes}
        changeAudioSource={changeAudioSource}
        getAudioSource={async function (): Promise<string> {
          throw new Error('Function not implemented.');
        }}
        cameraPublishing={false}
      />
      <EndCallButton classes={classes} handleEndCall={endCall} />
      <MuteVideoButton
        toggleVideo={toggleVideo}
        hasVideo={hasVideo}
        classes={classes}
        changeVideoSource={changeVideoSource}
        getVideoSource={function (): MediaDeviceInfo | null {
          throw new Error('Function not implemented.');
        }}
        cameraPublishing={false}
      />
    </div>
  ) : (
    <div className={classes.toolbarContainer}>
      <MoreOptionsButton
        classes={classes}
        participants={participants}
        room={room}
        localParticipant={localParticipant}
      />
      <MuteAudioButton
        toggleAudio={toggleAudio}
        hasAudio={hasAudio}
        classes={classes}
        changeAudioSource={changeAudioSource}
        getAudioSource={getAudioSource}
        cameraPublishing={cameraPublishing}
      />
      <MuteVideoButton
        toggleVideo={toggleVideo}
        hasVideo={hasVideo}
        classes={classes}
        getVideoSource={getVideoSource}
        cameraPublishing={cameraPublishing}
        changeVideoSource={changeVideoSource}
      />
      {VideoExpress.hasMediaProcessorSupport() && (
        <VideoFilterButton classes={classes} room={room} />
      )}
      <SpeakerSelector
        changeAudioOutput={() => changeAudioOutput}
        getCurrentAudioOutput={getCurrentAudioOutput}
        classes={classes}
        cameraPublishing={false}
      />
      <RecordingButton room={room} classes={classes} />
      <ScreenSharingButton
        isScreenSharing={isScreenSharing}
        startScreenSharing={startScreenSharing}
        stopScreenSharing={stopScreenSharing}
        classes={classes}
      />
      <MuteAllButton
        handleMuteAll={handleMuteAll}
        areAllMuted={areAllMuted}
        classes={classes}
      />
      <ReactionsButton
        // handleMuteAll={handleMuteAll}
        // areAllMuted={areAllMuted}
        // classes={classes}
        room={room}
      />
      <LayoutButton classes={classes} room={room} />
      <EndCallButton classes={classes} handleEndCall={endCall} />
    </div>
  );
}
