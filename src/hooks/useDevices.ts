import { useState, useEffect, useCallback } from 'react';
import * as VideoExpress from '@vonage/video-express';

export interface AudioOutputDevice {
  deviceId: string | null | undefined;
  label: string | null;
}

export interface DeviceInfo {
  audioInputDevices: AudioOutputDevice[] | [];
  videoInputDevices: AudioOutputDevice[] | [];
  audioOutputDevices: AudioOutputDevice[] | [];
}

export default function useDevices() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
  });

  const getDevices = useCallback(() => {
    if (!navigator?.mediaDevices?.enumerateDevices) {
      console.warn('enumerateDevices() not supported.');

      return;
    }

    (async () => {
      try {
        const devices = await VideoExpress.getDevices();
        let audioOutputDevices = await VideoExpress.getAudioOutputDevices();

        audioOutputDevices = audioOutputDevices.map((audioOutput) =>
          audioOutput.deviceId === 'default'
            ? { ...audioOutput, label: 'System Default' }
            : audioOutput,
        );

        const audioInputDevices: AudioOutputDevice[] =
          devices?.filter((d) => d.kind.toLowerCase() === 'audioinput') ?? [];

        const videoInputDevices: AudioOutputDevice[] =
          devices?.filter((d) => d.kind.toLowerCase() === 'videoinput') ?? [];

        setDeviceInfo({
          audioInputDevices,
          videoInputDevices,
          audioOutputDevices,
        });

        return;
      } catch (err) {
        console.log('[loadDevices] - ', err);
      }
    })();
  }, []);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);

  return { deviceInfo, getDevices };
}
