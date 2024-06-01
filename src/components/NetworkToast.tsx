import { useEffect, useState } from 'react';
import { IconButton, Snackbar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import RouterIcon from '@mui/icons-material/Router';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import styles from './styles';

interface NetworkToastProps {
  networkStatus: string;
}

export function NetworkToast({ networkStatus }: NetworkToastProps) {
  const [open, setOpen] = useState<boolean>(Boolean(networkStatus));
  const classes = styles({ networkStatus });

  const getIcon = () => {
    if (networkStatus === 'reconnected') {
      return <CheckCircleOutlineIcon className={classes.networkStatusIcons} />;
    }

    if (networkStatus === 'reconnecting') {
      return <RouterIcon className={classes.networkStatusIcons} />;
    }

    return <SignalWifiOffIcon className={classes.networkStatusIcons} />;
  };

  const handleClose = (reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    setOpen(Boolean(networkStatus));
  }, [networkStatus]);

  return (
    <div>
      <Snackbar
        className={classes.anchorOriginTopCenter}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        ContentProps={{
          classes: {
            root: classes.networkToastRoot,
            action: classes.action,
          },
        }}
        open={open}
        onClose={(event, reason) => handleClose(reason)}
        message={
          <div className={classes.snackBarContent}>
            {getIcon()}
            {networkStatus === 'reconnecting'
              ? 'You are disconnected. Please check your internet connection'
              : `You have been ${networkStatus}`}
          </div>
        }
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => handleClose()}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      />
    </div>
  );
}
