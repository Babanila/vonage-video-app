import React, { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
} from '@mui/material';

interface ListLayOutOptionsProps {
  openModal: boolean;
  classes: {
    paper: string;
  };
  handleCloseModal: () => void;
}

export const ListAudioSources: React.FC<ListLayOutOptionsProps> = ({
  openModal,
  classes,
  handleCloseModal,
}) => {
  const [modalStyle] = useState(getModalStyle);

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>Layout</FormLabel>
        <RadioGroup aria-label='layout' name='layout' defaultValue='Mic 1'>
          <FormControlLabel value='Mic 1' control={<Radio />} label='Mic 1' />
          <FormControlLabel value='Mic 2' control={<Radio />} label='Mic 2' />
        </RadioGroup>
      </FormControl>
    </div>
  );

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </div>
  );
};
