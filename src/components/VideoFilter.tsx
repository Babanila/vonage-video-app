import React, { useState } from 'react';
import * as VideoExpress from '@vonage/video-express';
import { CircularProgress } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import makeStyles from '@mui/styles/makeStyles';

const backgroundImages: string[] = ['vonage_background', 'simpson_background'];

interface VideoFilterProps {
  handleChangeVideoFilter: (filterName: string, filterPayload: any) => void;
}

const useStyles = makeStyles({
  videoFilterContainer: {
    // your styles
  },
  flex: {
    // your styles
  },
  backgroundLoading: {
    // your styles
  },
  buttonContainer: {
    // your styles
  },
  backgroundImage: {
    // your styles
  },
});

export const VideoFilter: React.FC<VideoFilterProps> = ({
  handleChangeVideoFilter,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);

  const applyFilter = (filterName: string, filterPayload: string | Blob) => {
    void (async () => {
      setLoading(true);
      const imageEl = await loadImage(filterPayload as string);

      switch (filterName) {
        case 'backgroundImage':
          handleChangeVideoFilter('backgroundImage', imageEl);
          break;
        default:
          handleChangeVideoFilter(filterName, filterPayload);
      }

      setLoading(false);
    })();
  };

  const PUBLIC_URL = '/';
  const loadImage = async (name: string) => {
    const res = await fetch(
      `${PUBLIC_URL}/backgrounds/${name}.jpeg`,
      // `${process.env.PUBLIC_URL}/backgrounds/${name}.jpeg`,
    );
    const blob = await res.blob();

    return await blobToBase64(blob);
  };

  const blobToBase64 = async (blob: Blob) => {
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    });
  };

  if (VideoExpress.hasMediaProcessorSupport()) {
    return (
      <div className={classes.videoFilterContainer}>
        <p>Background Options</p>
        <div className={classes.flex}>
          {loading && (
            <div className={classes.backgroundLoading}>
              <CircularProgress />
            </div>
          )}
          <div
            className={classes.buttonContainer}
            onClick={() => applyFilter('reset', '')}
            role="presentation"
          >
            <BlockIcon
              style={{
                transform: 'scale(1.5)',
                position: 'absolute',
                top: 'calc(50% - 10px)',
                left: 'calc(50% - 10px)',
                fontSize: '21px',
              }}
            />
          </div>
          <div
            className={classes.buttonContainer}
            onClick={() => applyFilter('blur', 'low')}
            role="presentation"
          >
            <BlurOnIcon
              style={{
                transform: 'scale(1.5)',
                position: 'absolute',
                top: 'calc(50% - 10px)',
                left: 'calc(50% - 10px)',
                fontSize: '21px',
              }}
            />
          </div>
          <div
            className={classes.buttonContainer}
            onClick={() => applyFilter('blur', 'high')}
            role="presentation"
          >
            <BlurCircularIcon
              style={{
                transform: 'scale(1.5)',
                position: 'absolute',
                top: 'calc(50% - 10px)',
                left: 'calc(50% - 10px)',
                fontSize: '21px',
              }}
            />
          </div>
          {backgroundImages.map((img) => (
            <img
              key={img}
              onClick={() => applyFilter('backgroundImage', img)}
              className={classes.backgroundImage}
              src={`../assets/backgrounds/${img}.jpeg`}
              // src={`${PUBLIC_URL}/backgrounds/${img}.jpeg`}
              // src={`${process.env.PUBLIC_URL}/backgrounds/${img}.jpeg`}
              alt={`Background ${img}`}
              role="presentation"
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};
