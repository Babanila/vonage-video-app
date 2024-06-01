import type { FC } from 'react';
import { DEVICE_ACCESS_STATUS } from '../utils';
import styles from './styles';

const askDeviceMessage =
  'To join the video room, your browser will request access to your cam and mic.';
const deniedDeviceMessage =
  'It seems your browser is blocked from accessing your camera and/or microphone';

interface DeviceAccessAlertProps {
  accessStatus: string; // Adjust this type according to the actual type of DEVICE_ACCESS_STATUS (e.g., enum or specific string values)
}

export const DeviceAccessAlert: FC<DeviceAccessAlertProps> = ({
  accessStatus,
}) => {
  const classes = styles();
  const messageToDisplay =
    accessStatus === DEVICE_ACCESS_STATUS.PENDING
      ? askDeviceMessage
      : deniedDeviceMessage;
  const imgToDisplay =
    accessStatus === DEVICE_ACCESS_STATUS.PENDING
      ? '/images/access-dialog-pending.png'
      : '/images/access-dialog-rejected.png';

  return (
    <div className={classes.centeredContent}>
      <div className={classes.centeredText}>
        <h2 className={classes.devicesText}>{messageToDisplay}</h2>
        <img
          src={imgToDisplay}
          alt='Access Dialog'
          className={classes.devicesImages}
        />
      </div>
    </div>
  );
};
