import type { CSSProperties } from 'react';
import { useCallback, useState } from 'react';
import { IconButton, Modal, Tooltip } from '@mui/material';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import { VideoFilter } from './VideoFilter';
import styles from './styles';

interface VideoFilterButtonProps {
  classes: {
    toolbarButtons: string;
  };
  room: {
    camera: {
      clearVideoFilter: () => Promise<void>;
      setVideoFilter: (filter: {
        type: string;
        blurStrength?: string;
        backgroundImgUrl?: string;
      }) => Promise<void>;
    };
  };
}

interface VideoFilter {
  filterName: string;
  filterPayload: string;
}

export const VideoFilterButton: React.FC<VideoFilterButtonProps> = ({
  classes,
  room,
}) => {
  const [open, setOpen] = useState(false);
  const localClasses = styles();
  const [modalStyle] = useState<CSSProperties>(getModalStyle);
  const [, setVideoFilter] = useState<VideoFilter>({
    filterName: '',
    filterPayload: '',
  });

  function getModalStyle(): CSSProperties {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeVideoFilter = useCallback(
    (filter: string, filterPayload: string) => {
      const camera = room.camera;

      (async () => {
        if (camera && filter) {
          switch (filter) {
            case 'reset':
              await camera.clearVideoFilter();
              setVideoFilter({
                filterName: '',
                filterPayload: '',
              });
              break;
            case 'blur':
              await camera.setVideoFilter({
                type: 'backgroundBlur',
                blurStrength: filterPayload,
              });
              setVideoFilter({
                filterName: filter,
                filterPayload,
              });
              break;
            case 'backgroundImage':
              await camera.setVideoFilter({
                type: 'backgroundReplacement',
                backgroundImgUrl: filterPayload,
              });
              setVideoFilter({
                filterName: filter,
                filterPayload,
              });
              break;
            default:
            // do nothing
          }
        }
      })();
    },
    [room],
  );

  const body = (
    <div style={modalStyle} className={localClasses.paperVFB}>
      <VideoFilter handleChangeVideoFilter={handleChangeVideoFilter} />
    </div>
  );

  return (
    <>
      <Tooltip title={'Apply Video Filter'} aria-label="add">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="mic"
          onClick={handleOpen}
          className={classes.toolbarButtons}
        >
          <CameraEnhanceIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
};
