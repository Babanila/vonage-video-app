import type { FC, ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContactsIcon from '@mui/icons-material/Contacts';
import useSignal from '../hooks/useSignal';
import styles from './styles';

interface ChatInputProps {
  sendMessage: (text: string) => void;
}

interface Message {
  from?: {
    name?: string;
  };
  date: string;
  data: string;
}

interface ChatMessagesProps {
  chatMessages: Message[];
  chatClass: string;
}

interface ChatProps {
  room: any;
  listOfMessages: Message[];
}

export const Chat: FC<ChatProps> = ({ room, listOfMessages }) => {
  const { sendSignal } = useSignal({ room });

  const sendMessage = (text: string) => {
    if (room) sendSignal(text, 'text');
  };

  const classes = styles();

  return (
    <div className={classes.chatContainer}>
      <ChatMessages
        chatClass={classes.chatMessages}
        chatMessages={listOfMessages}
      />
      <div className={classes.chatInput}>
        <ChatInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export const ChatInput: FC<ChatInputProps> = ({ sendMessage }) => {
  const classes = styles();
  const [text, setText] = useState<string>('');

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMessage(text);
      setText('');
    }
  };

  const changeText = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <form className={classes.wrapForm} noValidate autoComplete='off'>
      <TextField
        onChange={changeText}
        onKeyDown={onKeyDown}
        id='standard-text'
        label='Chat'
        className={classes.wrapText}
        value={text}
      />
      <Button
        onClick={() => {
          sendMessage(text);
          setText('');
        }}
        variant='contained'
        color='primary'
        className={classes.button}
      >
        <SendIcon />
      </Button>
    </form>
  );
};

export const ChatMessages: FC<ChatMessagesProps> = ({
  chatMessages,
  chatClass,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToLastMessage();
  }, [chatMessages]);

  const scrollToLastMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const classes = styles();
  return (
    <div className={chatClass}>
      {chatMessages?.length > 0 ? (
        chatMessages.map((msg: Message, key) => {
          const derivedClassName: string = msg?.from?.name
            ? ''
            : classes.myMessage;

          return (
            <div
              ref={messagesEndRef}
              className={`${
                classes.messageContainer as string
              } ${derivedClassName}`}
              key={key}
            >
              <div className={classes.chatAvatar}>
                <ContactsIcon className={classes.iconChat} />
                <Typography color='textSecondary' variant='subtitle1'>
                  {derivedClassName}
                </Typography>
                <Typography
                  className={classes.time}
                  color='textSecondary'
                  variant='subtitle1'
                >
                  {msg.date}
                </Typography>
              </div>
              <div className={classes.chatContent}>
                <Typography color='textPrimary' variant='body1'>
                  {msg.data}
                </Typography>
              </div>
            </div>
          );
        })
      ) : (
        <div>There are no messages</div>
      )}
    </div>
  );
};
