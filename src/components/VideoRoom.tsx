import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getCredentials } from '../api';
import { useUserContext } from '../context/userContext';
import useRoom from '../hooks/useRoom';
import useScreenSharing from '../hooks/useScreenSharing';
import { ToolBar } from './ToolBar';
import { NetworkToast } from './NetworkToast';
import styles from './styles';

interface Credentials {
  apikey: string;
  sessionId: string;
  token: string;
}

interface Params {
  roomName: string;
}

export function VideoRoom() {
  const { user } = useUserContext();
  const { roomName } = useParams<Params>();
  const roomContainer = useRef<HTMLDivElement>(null);

  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const classes = styles();

  const {
    createCall,
    room,
    participants,
    connected,
    networkStatus,
    cameraPublishing,
    localParticipant,
  } = useRoom();
  const { isScreenSharing, startScreenSharing, stopScreenSharing } =
    useScreenSharing({ room });

  useEffect(() => {
    getCredentials(roomName)
      .then(({ data }) => {
        setCredentials({
          apikey: data.apiKey,
          sessionId: data.sessionId,
          token: data.token,
        });
      })
      .catch((err: Error) => {
        setError(err);
        console.log(err);
      });
  }, [roomName]);

  useEffect(() => {
    if (credentials) {
      (async () => {
        await createCall(
          credentials,
          roomContainer?.current,
          user?.userName,
          user?.videoFilter,
          {
            ...user?.defaultSettings,
          },
        );
      })();
    }
  }, [createCall, credentials, user]);

  if (error)
    return (
      <div className={classes.errorContainer}>
        There was an error fetching the data from the server
      </div>
    );

  return (
    <div id='callContainer' className={classes.callContainer}>
      <div
        id='roomContainer'
        className={classes.roomContainer}
        ref={roomContainer}
      >
        <NetworkToast networkStatus={networkStatus} />
        <div
          id='screenSharingContainer'
          className={classes.screenSharingContainer}
        >
          {isScreenSharing && (
            <div className={classes.screenSharingOverlay}>
              You Are Screensharing
            </div>
          )}
        </div>
      </div>
      <ToolBar
        room={room}
        participants={participants}
        localParticipant={localParticipant}
        connected={connected}
        cameraPublishing={cameraPublishing}
        isScreenSharing={isScreenSharing}
        startScreenSharing={() => startScreenSharing}
        stopScreenSharing={() => stopScreenSharing}
      />
    </div>
  );
}
