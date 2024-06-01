import { useState, useCallback } from 'react';

interface Room {
  screen: {
    on: (event: string, callback: (reason?: any) => void) => void;
  };
  startScreensharing: () => Promise<void>;
  stopScreensharing: () => void;
}

interface UseScreenSharingProps {
  room: Room | null;
}

interface UseScreenSharingReturn {
  screen: any | null;
  isScreenSharing: boolean | null;
  startScreenSharing: () => Promise<void>;
  stopScreenSharing: () => Promise<void>;
}

export default function useScreenSharing({
  room,
}: UseScreenSharingProps): UseScreenSharingReturn {
  const [screen, setScreen] = useState<any | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean | null>(null);

  const startScreenSharing = useCallback(async () => {
    if (room) {
      try {
        const { screen } = room;

        screen.on('started', () => {
          setScreen(screen);
          setIsScreenSharing(true);
        });

        screen.on('stopped', (reason) => {
          console.warn(
            '[useScreenSharing] - The screen sharing stopped because: ',
            reason,
          );
          setScreen(null);
          setIsScreenSharing(false);
        });

        screen.on('accessDenied', (reason) => {
          setScreen(null);
          setIsScreenSharing(false);
        });

        await room.startScreensharing();
      } catch (e) {
        console.error('[useScreenSharing] - startScreenSharing error:', e);
      }
    }
  }, [room]);

  const stopScreenSharing = useCallback(async () => {
    if (room) {
      room.stopScreensharing();
      setIsScreenSharing(false); // TODO: Temporary fix because the events are not being triggered
    }
  }, [room]);

  return {
    screen,
    isScreenSharing,
    startScreenSharing,
    stopScreenSharing,
  };
}
