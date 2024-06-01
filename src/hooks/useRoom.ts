import { useState, useRef, useCallback } from 'react';
import * as VideoExpress from '@vonage/video-express';

import { throttle } from '../utils.js';

interface Participant {
  id?: string;
  name?: string;
}

interface Room extends VideoExpress.Room {}

interface VideoFilter {
  filterName: string;
  filterPayload: any;
}

interface CreateCallParams {
  apikey: string;
  sessionId: string;
  token: string;
}

export default function useRoom() {
  const roomRef = useRef<Room | null>(null);
  const publisherOptionsRef = useRef<any>(null);
  const [camera, setCamera] = useState<any>(null);
  const [screen, setScreen] = useState<any>(null);
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(
    null,
  );
  const [connected, setConnected] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [networkStatus, setNetworkStatus] = useState<string | null>(null);
  const [publisherIsSpeaking, setPublisherIsSpeaking] =
    useState<boolean>(false);
  const [cameraPublishing, setCameraPublishing] = useState<boolean>(false);

  const addParticipants = ({ participant }: { participant: Participant }) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const removeParticipants = ({
    participant,
  }: {
    participant: Participant;
  }) => {
    setParticipants((prev) =>
      prev.filter((prevParticipant) => prevParticipant.id !== participant.id),
    );
  };

  const addLocalParticipant = ({ room }: { room: Room }) => {
    if (room) {
      setLocalParticipant({
        id: room.participantId,
        name: room.participantName,
      });
    }
  };

  const removeLocalParticipant = ({
    participant,
  }: {
    participant: Participant;
  }) => {
    setParticipants([]);
  };

  const onAudioLevel = useCallback((audioLevel: number) => {
    let movingAvg: number | null = null;
    if (movingAvg === null || movingAvg <= audioLevel) {
      movingAvg = audioLevel;
    } else {
      movingAvg = 0.8 * movingAvg + 0.2 * audioLevel;
    }

    const currentLogLevel = Math.log(movingAvg) / Math.LN10 / 1.5 + 1;

    if (currentLogLevel > 0.4) {
      setPublisherIsSpeaking(true);
    } else {
      setPublisherIsSpeaking(false);
    }
  }, []);

  const addPublisherCameraEvents = () => {
    if (roomRef?.current?.camera) {
      roomRef.current.camera.on(
        // @ts-expect-error
        'audioLevelUpdated',
        throttle((event: any) => onAudioLevel(event), 25),
      );
    }
  };

  const parseVideoFilter = (videoFilter: VideoFilter) => {
    switch (videoFilter.filterName) {
      case 'blur':
        return {
          type: 'backgroundBlur',
          blurStrength: videoFilter.filterPayload,
        };
      case 'backgroundImage':
        return {
          type: 'backgroundReplacement',
          backgroundImgUrl: videoFilter.filterPayload,
        };
      default:
        return {};
    }
  };

  const startRoomListeners = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.on('connected', () => {
        console.log('Room: connected');
      });

      roomRef.current.on('disconnected', () => {
        setNetworkStatus('disconnected');
        console.log('Room: disconnected');
      });

      roomRef.current.camera.on('created', () => {
        setCameraPublishing(true);
        console.log('camera publishing now');
      });

      roomRef.current.on('activeSpeakerChanged', (participant: any) => {
        console.log('Active speaker changed', participant);
      });

      roomRef.current.on('reconnected', () => {
        setNetworkStatus('reconnected');
        console.log('Room: reconnected');
      });

      roomRef.current.on('reconnecting', () => {
        setNetworkStatus('reconnecting');
        console.log('Room: reconnecting');
      });

      roomRef.current.on('participantJoined', (participant: any) => {
        console.log(participant);
        addParticipants({ participant });
        console.log('Room: participant joined: ', participant);
      });

      roomRef.current.on('participantLeft', (participant: any, reason: any) => {
        removeParticipants({ participant });
        console.log('Room: participant left', participant, reason);
      });
    }
  }, []);

  const createCall = useCallback(
    async (
      { apikey, sessionId, token }: CreateCallParams,
      roomContainer: string,
      userName: string,
      videoFilter: VideoFilter | null,
      publisherOptions: any,
    ) => {
      if (!apikey || !sessionId || !token) {
        throw new Error('Check your credentials');
      }

      roomRef.current = new VideoExpress.Room({
        apiKey: apikey,
        sessionId,
        token,
        roomContainer: 'roomContainer',
        maxVideoParticipantsOnScreen: 2,
        participantName: userName,
        managedLayoutOptions: {
          layoutMode: 'grid',
          screenPublisherContainer: 'screenSharingContainer',
          speakerHighlightEnabled: true,
        },
      });

      startRoomListeners();

      if (videoFilter?.filterName && videoFilter?.filterPayload) {
        publisherOptionsRef.current = {
          ...publisherOptions,
          style: {
            buttonDisplayMode: 'off',
            nameDisplayMode: 'auto',
            audioLevelDisplayMode: 'off',
          },
          name: userName,
          showControls: true,
          videoFilter: parseVideoFilter(videoFilter),
        };
      } else {
        publisherOptionsRef.current = {
          ...publisherOptions,
          style: {
            buttonDisplayMode: 'off',
            nameDisplayMode: 'auto',
            audioLevelDisplayMode: 'off',
          },
          name: userName,
          showControls: true,
        };
      }

      try {
        await roomRef.current.join({
          publisherProperties: publisherOptionsRef.current,
        });
        setConnected(true);
        setCamera(roomRef.current.camera);
        setScreen(roomRef.current.screen);
        addLocalParticipant({ room: roomRef.current });
      } catch (e) {
        console.log(e);
      }
    },
    [],
  );

  return {
    createCall,
    connected,
    camera,
    screen,
    room: roomRef.current,
    participants,
    networkStatus,
    publisherIsSpeaking,
    cameraPublishing,
    localParticipant,
    removeLocalParticipant,
    addPublisherCameraEvents,
  };
}
