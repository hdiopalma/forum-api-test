const CommentHandler = require('./handler');
const routes = require('./routes');

class CommentPlugin {
   constructor(container) {
      this.commentHandler = new CommentHandler(container);
   }

   register(server) {
      server.route(routes(this.commentHandler));
   }
}

module.exports = {
   name: 'comments',
   register: async (server, { container }) => {
      const plugin = new CommentPlugin(container);
      plugin.register(server);
   },
};
