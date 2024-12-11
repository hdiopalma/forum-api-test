const routes = require('./routes');
const AuthenticationsHandler = require('./handler');

class AuthModule {
   constructor(container) {
      this.authenticationsHandler = new AuthenticationsHandler(container);
   }

   register(server) {
      server.route(routes(this.authenticationsHandler));
   }
}

module.exports = {
   name: 'authentications',
   register: async (server, { container }) => {
      const authModule = new AuthModule(container);
      authModule.register(server);
   },
};
