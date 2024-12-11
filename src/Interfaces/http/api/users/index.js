const UsersHandler = require('./handler');
const routes = require('./routes');

class UsersPlugin {
   constructor(container) {
      this.usersHandler = new UsersHandler(container);
   }

   async register(server) {
      server.route(routes(this.usersHandler));
   }
}

module.exports = {
   name: 'users',
   register: async (server, { container }) => {
      const plugin = new UsersPlugin(container);
      await plugin.register(server);
   },
};
