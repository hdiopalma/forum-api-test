const ThreadHandler = require('./handler');
const routes = require('./routes');

class ThreadsPlugin {
   constructor(container) {
      this.threadHandler = new ThreadHandler(container);
   }

   async register(server) {
      server.route(routes(this.threadHandler));
   }
}

module.exports = {
   name: 'threads',
   register: async (server, { container }) => {
      const plugin = new ThreadsPlugin(container);
      await plugin.register(server);
   },
};
