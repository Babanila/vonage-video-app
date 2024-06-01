import axios from 'axios';

const API_SERVER_URL = 'http://localhost:5000/';

export const getCredentials = async (roomName: string) => {
  return await axios.get(`${API_SERVER_URL}/session/${roomName}`);
};

const fetchRecordings = async (sessionId: string) => {
  return await axios.get(`${API_SERVER_URL}/archive/${sessionId}`);
};

const startRecording = async (sessionId: string) => {
  return await axios.post(`${API_SERVER_URL}/archive/start`, {
    session_id: sessionId,
  });
};

const stopRecording = async (archiveId: string) => {
  return await axios.get(`${API_SERVER_URL}/archive/stop/${archiveId}`);
};

export { fetchRecordings, startRecording, stopRecording };
