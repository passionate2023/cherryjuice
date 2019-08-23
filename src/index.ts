import { app } from './server';
import * as http from 'http';
import { onError, onListening } from './helpers/server';
import {createDebug} from "./helpers/misc";

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */


server.listen(port);
server.on('error', onError({ port }));
server.on('listening', onListening({ server }));
