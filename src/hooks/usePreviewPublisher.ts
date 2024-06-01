import { useState, useRef, useCallback } from 'react';
import * as VideoExpress from '@vonage/video-express';

import { DEVICE_ACCESS_STATUS } from '../utils.js';
import type { DeviceInfo } from '../hooks/useDevices.js';
import useDevices from '../hooks/useDevices.js';

interface PublisherOptions {
  [key: string]: any;
}

interface UsePreviewPublisherReturn {
  accessAllowed: string;
  deviceInfo: DeviceInfo;
  logLevel: number;
  previewMediaCreated: boolean;
  previewPublisher: VideoExpress.PreviewPublisher | null;
  createPreview: (
    targetEl: HTMLElement,
    publisherOptions: PublisherOptions,
  ) => Promise<void>;
  destroyPreview: () => void;
}

export function usePreviewPublisher(): UsePreviewPublisherReturn {
  const previewPublisher = useRef<VideoExpress.PreviewPublisher | null>(null);
  const [logLevel, setLogLevel] = useState<number>(0);
  const [previewMediaCreated, setPreviewMediaCreated] =
    useState<boolean>(false);
  const [accessAllowed, setAccessAllowed] = useState<string>(
    DEVICE_ACCESS_STATUS.PENDING,
  );
  const { deviceInfo, getDevices } = useDevices();

  const calculateAudioLevel = useCallback((audioLevel: number) => {
    let movingAvg: number | null = null;
    if (movingAvg === null || movingAvg <= audioLevel) {
      movingAvg = audioLevel;
    } else {
      movingAvg = 0.8 * movingAvg + 0.2 * audioLevel;
    }

    // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
    const currentLogLevel = Math.log(movingAvg) / Math.LN10 / 1.5 + 1;
    setLogLevel(Math.min(Math.max(currentLogLevel, 0), 1) * 100);
  }, []);

  const createPreview = useCallback(
    async (targetEl: HTMLElement, publisherOptions: PublisherOptions) => {
      try {
        const publisherProperties = { ...publisherOptions };
        previewPublisher.current = new VideoExpress.PreviewPublisher(targetEl);

        previewPublisher.current.on(
          'audioLevelUpdated',
          (audioLevel: number) => {
            calculateAudioLevel(audioLevel);
          },
        );

        previewPublisher.current.on('accessAllowed', () => {
          setAccessAllowed(DEVICE_ACCESS_STATUS.ACCEPTED);
          getDevices();
        });

        previewPublisher.current.on('accessDenied', () => {
          setAccessAllowed(DEVICE_ACCESS_STATUS.REJECTED);
        });

        await previewPublisher.current.previewMedia({
          targetElement: targetEl,
          publisherProperties,
        });

        setPreviewMediaCreated(true);
      } catch (err) {
        console.error('[createPreview]', err);
      }
    },
    [calculateAudioLevel, getDevices],
  );

  const destroyPreview = useCallback(() => {
    if (previewPublisher.current) {
      previewPublisher.current.destroy();
      previewPublisher.current = null;
    }
  }, []);

  return {
    previewPublisher: previewPublisher?.current,
    createPreview,
    destroyPreview,
    logLevel,
    previewMediaCreated,
    accessAllowed,
    deviceInfo,
  };
}
