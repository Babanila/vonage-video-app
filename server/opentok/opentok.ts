import type {
  Archive,
  ArchiveOptions,
  PredefinedArchiveLayoutOptions,
  Session,
} from 'opentok';
import OpenTok from 'opentok';

const apiKey = process.env.VIDEO_API_API_KEY;
const apiSecret = process.env.VIDEO_API_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    'Missing config values for env params OT_API_KEY and OT_API_SECRET',
  );
}

export type ArchiveType = Archive;

let sessionId;
const opentok = new OpenTok(apiKey, apiSecret, { timeout: 30000 });

export type SessionType = Session & {
  token: string;
};

const createSessionandToken = async () => {
  return await new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: 'routed' }, function (error, session) {
      if (error) {
        reject(error);
      } else {
        sessionId = session?.sessionId as string;
        const token = opentok.generateToken(sessionId);

        resolve({ sessionId, token });
      }
    });
  });
};

const createArchive = async (session: string) => {
  return await new Promise((resolve, reject) => {
    const layout: PredefinedArchiveLayoutOptions = {
      type: 'horizontalPresentation',
    };
    const options: ArchiveOptions = {
      layout,
    };

    opentok.startArchive(session, options, function (error, archive) {
      if (error) {
        reject(error);
      } else {
        resolve(archive);
      }
    });
  });
};

const stopArchive = async (archive: string) => {
  return await new Promise((resolve, reject) => {
    opentok.stopArchive(archive, function (error, session) {
      if (error) {
        reject(error);
      } else {
        resolve(archive);
      }
    });
  });
};

const generateToken = (sessionId: string) => {
  const token = opentok.generateToken(sessionId);
  return { token, apiKey };
};

const initiateArchiving = async (sessionId: string) => {
  const archive = await createArchive(sessionId);
  return archive;
};

const stopArchiving = async (archiveId: string) => {
  const response = await stopArchive(archiveId);
  return response;
};

const getCredentials = async () => {
  const data = (await createSessionandToken()) as SessionType;
  sessionId = data.sessionId;
  const token = data.token;
  return { sessionId, token, apiKey };
};

const listArchives = async (sessionId: any) => {
  return await new Promise((resolve, reject) => {
    const options = { sessionId };
    opentok.listArchives(options, (error, archives) => {
      if (error) {
        reject(error);
      } else {
        resolve(archives);
      }
    });
  });
};

export default {
  getCredentials,
  generateToken,
  initiateArchiving,
  stopArchiving,
  listArchives,
};
