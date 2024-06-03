import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';

import type { ArchiveType } from './opentok/opentok.js';
import opentok from './opentok/opentok.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV ?? 'development';
const envPath = path.join(__dirname, '..');
console.log('envPath', envPath);

config({ path: `${envPath}/.env.${env}` });
console.log('Node Running Environement:', env);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sessions: Record<string, string> = {
  roomName: '',
};

app.get('/session/:room', async (req, res) => {
  try {
    const { room: roomName } = req.params;
    const derivedRoom = sessions[roomName];

    if (derivedRoom) {
      const data = opentok.generateToken(derivedRoom);

      res.json({
        sessionId: derivedRoom,
        token: data.token,
        apiKey: data.apiKey,
      });
    } else {
      const data = await opentok.getCredentials();
      sessions[roomName] = data.sessionId;

      res.json({
        sessionId: data.sessionId,
        token: data.token,
        apiKey: data.apiKey,
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.post('/archive/start', async (req, res) => {
  const { sessionId } = req.body;

  try {
    const response = (await opentok.initiateArchiving(
      sessionId,
    )) as ArchiveType;

    res.json({
      archiveId: response.id,
      status: response.status,
    });
  } catch (error: any) {
    console.error(error?.message);
    res.status(500).send({ message: error?.message });
  }
});

app.get('/archive/stop/:archiveId', async (req, res) => {
  const { archiveId } = req.params;

  try {
    const response = await opentok.stopArchiving(archiveId);

    res.json({
      archiveId: response,
      status: 'stopped',
    });
  } catch (error: any) {
    console.error(error?.message);
    res.status(500).send({ message: error?.message });
  }
});

app.get('/archive/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const archives = await opentok.listArchives(sessionId);
    res.json(archives);
  } catch (error: any) {
    console.error(error?.message);
    res.status(500).send({ message: error?.message });
  }
});

if (env === 'production') {
  console.log('Setting Up express.static for prod');
  const buildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

const serverPort = process.env.SERVER_PORT ?? 5000;
app.listen(serverPort, () => {
  console.log('Server started on port', serverPort);
});
