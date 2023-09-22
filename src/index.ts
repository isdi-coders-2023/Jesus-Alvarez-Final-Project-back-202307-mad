import createDebug from 'debug';
import 'dotenv/config';
import { createServer } from 'http';
import { app } from './app.js';
import { dbConnect } from './dbConnect/db-Connect.js';

const PORT = process.env.PORT ?? 3000;
const debug = createDebug('PF11:Index');
const server = createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to DataBase: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  debug(`Listening on port ${PORT}`);
});

server.on('error', (error) => {
  debug(`Error ${error.message}`);
});
