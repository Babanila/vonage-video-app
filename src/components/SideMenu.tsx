import type { ReactNode } from 'react';
import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { MeetingInfo } from './MeetingInfo';
import { Chat } from './Chat';

interface SideMenuProps {
  participants: Array<{ id: string; name: string }> | null;
  room: { roomId: string };
  localParticipant: { id: string; name: string } | null;
  listOfMessages: any;
}

const TabPanel: React.FC<{
  children: ReactNode;
  value: number;
  index: number;
}> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Container>
          <Box>{children}</Box>
        </Container>
      )}
    </div>
  );
};

export const SideMenu: React.FC<SideMenuProps> = ({
  participants,
  room,
  localParticipant,
  listOfMessages,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Chat" {...a11yProps(0)} />
          <Tab label="List of Participants" {...a11yProps(1)} />
          <Tab label="Meeting info" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Chat room={room} listOfMessages={listOfMessages} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MeetingInfo roomId={room.roomId} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <List>
          {participants && (
            <>
              <ListItem key={'participants_counter'}>
                <ListItemIcon>
                  <GroupIcon variant="contained" color="primary" />
                </ListItemIcon>
                Participants ({participants.length + 1})
              </ListItem>
            </>
          )}
          {localParticipant && (
            <>
              <ListItem key={localParticipant.id}>
                <ListItemIcon>
                  <PersonIcon variant="contained" color="primary" />
                </ListItemIcon>
                <ListItemText primary={localParticipant.name} />
              </ListItem>
              <Divider />
            </>
          )}
          {participants &&
            participants.length > 0 &&
            participants.map((e) => {
              return (
                <React.Fragment key={e.id}>
                  <ListItem key={e.id}>
                    <ListItemIcon>
                      <PersonIcon variant="contained" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={e.name} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
        </List>
      </TabPanel>
    </div>
  );
};
