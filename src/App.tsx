
import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useUserContext } from './context/userContext';
import { EndCall } from './components/EndCall';
import { Error } from './components/Error';
import { UserNameRoute } from './components/UserNameRoute';
import { VideoRoom } from './components/VideoRoom';
import { WaitingRoom } from './components/WaitingRoom';
import './app.module.css';

export default function App() {
  const { setUser } = useUserContext();

  React.useEffect(() => {
    setUser({
      userName: '',
      videoFilter: {
        filterName: '',
        filterPayload: '',
      },
      defaultSettings: {
        publishAudio: true,
        publishVideo: true,
        audioSource: undefined,
        videoSource: undefined,
        audioOutput: undefined,
      },
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path='/room/:roomName/:sessionId/end'>
          <EndCall />
        </Route>
        <UserNameRoute exact path='/room/:roomName' component={VideoRoom} />
        {/* <Route exact path='/room/:roomName' component={VideoRoom}></Route> */}
        <Route path='/error' component={Error}></Route>
        <Route exact path='/' component={WaitingRoom}></Route>
        <Route path='*'>
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        </Route>
      </Switch>
    </Router>
  );
}
