import * as http from 'http';
import { app } from './server';
import { applyApollo } from './graphql/';

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
applyApollo(app);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  const addr = server.address();
  console.log(
    `Listening on ${
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    }`,
  );
});
