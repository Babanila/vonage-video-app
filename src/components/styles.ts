import type { Theme } from '@mui/material/styles';
import { createStyles } from '@mui/styles';
import makeStyles from '@mui/styles/makeStyles';
import { blueGrey } from '@mui/material/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    // Chat styles
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '90vh',
      padding: '5px 15px',
      overflow: 'hidden',
    },
    chatInput: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    chatMessages: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 80%',
      overflowY: 'scroll',
      color: '#fff',
    },
    // ChatInput styles
    wrapForm: {
      display: 'flex',
      width: '95%',
    },
    wrapText: {
      width: '100%',
    },
    button: {
      // margin: theme.spacing(1),
    },
    // ChatMessage styles
    messageContainer: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '5px',
      padding: '10px',
      margin: '5px',
      backgroundColor: theme.palette.primary.main,
      overflowY: 'scroll',
    },
    myMessage: {
      background: '#fff',
      border: `2px solid ${theme.palette.primary.main}`,
    },
    iconChat: {
      marginRight: '5px',
    },
    time: {
      marginLeft: 'auto',
    },
    mine: {
      left: '0',
    },
    others: {
      right: '0',
    },
    chatAvatar: {
      display: 'flex',
    },
    chatContent: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '20vw',
    },
    // DeviceAccessAlert styles
    centeredContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      textAlign: 'center',
    },
    centeredText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      color: '#ffffff',
    },
    devicesText: {
      fontSize: '36px',
      lineHeight: '1em',
    },
    devicesImages: {
      width: '100%',
      maxWidth: '350px',
    },
    // EndCall styles
    banner: {
      zIndex: 1,
      margin: '200px',
      height: '100px',
      width: '50%',
      alignItems: 'center',
      borderRadius: '30px',
      backgroundColor: 'black',
    },
    container: {
      '@media (min-width:768px)': {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignContent: 'center',
    },
    new__meeting: {
      color: 'rgb(43,158,250)',
    },
    meetingInfo: {
      margin: '100px',
      width: '50%',
      height: '100px',
      color: 'white',
    },
    recording: {
      display: 'flex',
      flexDirection: 'row',
    },
    root: {
      minWidth: 275,
      margin: 'auto',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    centeredFlex: {
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
      borderRadius: '30px',
    },
    // LayoutButton styles
    choosen: {
      backgroundColor: theme.palette.primary.main,
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
    // MeetingInfo styles
    list: {
      width: 350,
      margin: 'auto',
    },
    //   root: {
    //     margin: auto
    //   },
    buttonMI: {
      margin: theme.spacing(1),
    },

    qrCode: {
      margin: 'auto',
    },

    toolTip: {
      position: 'absolute',
      left: '0',
      bottom: '10px',
    },
    containerMI: {
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      margin: 'auto',
      marginTop: '6px',
    },
    versionLabel: {
      marginLeft: '15px',
    },
    listItem: {
      paddingTop: '2px',
    },
    sessionLabel: {
      wordBreak: 'break-word',
    },
    // MoreOptionsButton styles
    infoButtonMOB: {
      position: 'absolute',
      left: '0',
      bottom: '10px',
      margin: theme.spacing(1),
      borderRadius: '5em',
      height: '50px',
      width: '50px',
      backgroundColor: '#32353A',
      color: '#fff',
    },
    paperMOB: {
      overflowY: 'hidden',
    },
    // MuteAudioButton styles
    selectedMAB: {
      color: '#b779ff',
    },
    // MuteVideoButton styles
    selectedMVB: {
      color: '#b779ff',
      backgroundColor: 'black',
    },
    // NetworkToast styles
    anchorOriginTopCenter: {},
    networkToastRoot: {
      top: '0',
      background: ({ networkStatus }) => {
        if (networkStatus === 'disconnected') return '#e25141';
        if (networkStatus === 'reconnecting') return '#f19c38';
        if (networkStatus === 'reconnected') return '#4caf50';
      },
      /* width: '100%', */
      justifyContent: 'center',
    },
    info: {
      top: '0',
      background: '#418be9',
      justifyContent: 'center',
    },
    action: {
      position: 'absolute',
      right: '0',
      paddingRight: '10px',
    },
    networkStatusIcons: {
      paddingRight: '10px',
    },
    snackBarContent: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    // RecordingButton styles
    activeRecordingIcon: {
      boxShadow: '0 0 0 0 rgba(213, 15, 45, 1)',
      animation: 'pulse-red 2s infinite',
      borderRadius: '100%',
    },
    // SpeakerSelector styles
    selectedSS: {
      color: '#b779ff',
    },
    // ToolBar styles
    toolbarContainer: {
      backgroundColor: '#41464D',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '90px',
      margin: theme.spacing(2),
      borderRadius: '25px',
    },
    paper: {
      position: 'absolute',
      display: 'flex',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    toolbarMobileContainer: {
      backgroundColor: '#41464D',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      margin: theme.spacing(2),
      borderRadius: '25px',
    },
    toolbarButtons: {
      margin: theme.spacing(1),
      borderRadius: '5em',
      backgroundColor: '#32353A',
      color: '#fff',
    },
    arrowButton: {
      borderRadius: '5em',
      height: '50px',
      width: '50px',
      backgroundColor: '#32353A',
      color: '#fff',
    },
    infoButton: {
      position: 'absolute',
      left: '0',
      margin: theme.spacing(1),
      borderRadius: '5em',
      height: '50px',
      width: '50px',
      backgroundColor: '#32353A',
      color: '#fff',
    },
    groupButton: {
      margin: '8px',
    },
    disabledButton: {
      backgroundColor: '#D50F2C',
      '&:hover': {
        backgroundColor: '#D50F2C',
      },
    },
    activeButton: {
      backgroundColor: '#1C8731',
      '&:hover': {
        backgroundColor: '#1C8731',
      },
    },
    activeButtonIcon: {
      color: '#1C8731',
    },
    // VideoFilter styles
    videoFilterContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px 0',
    },
    buttonContainer: {
      border: '2px solid #757575',
      borderRadius: '0.75rem',
      backgroundColor: '#bdbdbd',
      margin: '0 5px',
      width: '62px',
      height: '62px',
      position: 'relative',
      cursor: 'pointer',
    },
    backgroundImage: {
      width: '64px',
      height: '64px',
      borderRadius: '0.75rem',
      margin: '0 5px',
      cursor: 'pointer',
    },
    backgroundLoading: {
      position: 'absolute',
      left: 0,
      // background: "rgba(0,0,0,0.5)",
      right: 0,
      textAlign: 'center',
      zIndex: 3,
      height: '70px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
    },
    // VideoFilterButton
    paperVFB: {
      position: 'absolute',
      display: 'flex',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    // WaitingRoom styles
    waitingRoomContainer: {
      position: 'absolute',
      top: '60%',
      left: '50%',
      display: 'flex',
      flexDirection: 'column',
      transform: 'translate(-50%, -50%)',
      backgroundColor: blueGrey[100],
      padding: '25px',
      borderRadius: 5,
      width: '400px',
    },
    form: {},
    formControl: {
      width: '100%',
    },
    mediaSources: {
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
    },
    waitingRoomVideoPreview: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0px',
      minHeight: '200px',
    },
    deviceContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px 5px',
    },
    deviceSettings: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    networkTestContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px 5px',
    },
    flex: {
      display: 'flex',
    },
    // VideoRoom styles
    callContainer: {
      height: '100vh',
      position: 'relative',
      backgroundColor: '#20262D',
    },
    roomContainer: {
      position: 'relative',
      height: 'calc(100vh - 90px)',
    },
    errorContainer: {
      color: 'white',
      position: 'absolute',
      top: '50%',
      left: '50%',
    },
    videoRoomToolbarContainer: {
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    screenSharingContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 9,
    },
    screenSharingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 9,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '22px',
      color: '#fff',
    },
  }),
);
