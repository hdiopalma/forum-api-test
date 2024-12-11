require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

async function startServer() {
   const server = await createServer(container);
   await server.start();
   console.log(`Server started at ${server.info.uri}`);
}

startServer().catch((err) => {
   console.error('Failed to start server:', err);
   process.exit(1);
});
