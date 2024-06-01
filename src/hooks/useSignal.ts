import { useCallback, useEffect, useState } from 'react';

import { EMOJIS } from '../utils.js';

interface Room {
  signal: ({ type, data }: { type: string; data: any }) => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  off: (event: string, callback: (args: any) => void) => void;
}

interface SignalArgs {
  data: string;
  isSentByMe: boolean;
  from: { camera: { id: string } };
}

interface Message {
  data: string;
  isSentByMe: boolean;
  from: any;
  date: string;
}

interface UseSignalProps {
  room: Room | null;
}

export default function useSignal({ room }: UseSignalProps) {
  const [listOfMessages, setListOfMessages] = useState<Message[]>([]);

  const sendSignal = useCallback(
    (data: string, type: string) => {
      if (room) {
        room.signal({ type, data }).catch((e) => console.error(e));
      }
    },
    [room],
  );

  const signalListener = useCallback(
    ({ data, isSentByMe, from }: SignalArgs) => {
      const date = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      addMessageToList(data, isSentByMe, from, date);
    },
    [],
  );

  const removeEmoji = (node: Node, element: string) => {
    document.getElementById(element)?.removeChild(node);
  };

  const emojiHandler = useCallback(({ data, isSentByMe, from }: SignalArgs) => {
    const elementToInsertEmoji = isSentByMe
      ? 'MP_camera_publisher_default_controls'
      : from.camera.id;

    const node = document.createElement('div');
    node.appendChild(document.createTextNode(EMOJIS[data] as string));
    node.classList.add('emoji');
    document.getElementById(elementToInsertEmoji)?.appendChild(node);

    node.addEventListener('animationend', (e) => {
      removeEmoji(e.target as Node, elementToInsertEmoji);
    });
  }, []);

  const addMessageToList = useCallback(
    (data: string, isSentByMe: boolean, from: any, date: string) => {
      setListOfMessages((prev) => [...prev, { data, isSentByMe, from, date }]);
    },
    [],
  );

  useEffect(() => {
    if (room) {
      room.on('signal:text', signalListener);
      room.on('signal:emoji', emojiHandler);
    }

    return function cleanup() {
      if (room) {
        room.off('signal:text', signalListener);
        room.off('signal:emoji', emojiHandler);
      }
    };
  }, [room, signalListener, emojiHandler]);

  return {
    sendSignal,
    listOfMessages,
  };
}
