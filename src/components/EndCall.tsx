import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import { fetchRecordings } from '../api';
import styles from './styles';

interface Recording {
  id: string;
  createdAt: string;
  status: string;
  url: string;
}

interface Params {
  sessionId: string;
}

export const EndCall: React.FC = () => {
  const classes = styles();
  const history = useHistory();

  const [recordings, setRecordings] = useState<Recording[] | null>(null);
  const { sessionId } = useParams<Params>();

  const redirectNewMeeting = () => {
    history.push('/');
  };

  useEffect(() => {
    fetchRecordings(sessionId)
      .then((data) => {
        if (data.data) {
          setRecordings(data.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [sessionId]);

  return (
    <div className={classes.container}>
      <div className={classes.meetingInfo}>
        <h2>This is an amazing meeting</h2>
        <h2>I hope you have had fun with us</h2>

        <IconButton
          onClick={redirectNewMeeting}
          className={classes.new__meeting}
        >
          Start new meeting
        </IconButton>
      </div>
      <div className={classes.banner}>
        <Card className={classes.centeredFlex} variant='outlined'>
          <CardContent>
            {recordings?.length ? (
              <h3>Recordings</h3>
            ) : (
              <h3>There are no recordings</h3>
            )}
          </CardContent>
          <CardActions>
            <div className={classes.root}>
              {recordings ? (
                <div className={classes.recording}>
                  <ul>
                    {recordings.map((recording) => (
                      <li key={recording.id}>
                        Started at: {new Date(recording.createdAt).toString()}
                        {recording.status === 'available' ? (
                          <Button
                            color='inherit'
                            edge='start'
                            target='_blank'
                            href={recording.url}
                          >
                            <GetAppIcon />
                          </Button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};
