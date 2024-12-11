const CommentReplyHandler = require('./handler');
const routes = require('./routes');

class CommentRepliesPlugin {
   constructor(container) {
      this.handler = new CommentReplyHandler(container);
   }

   register(server) {
      server.route(routes(this.handler));
   }
}

module.exports = {
   name: 'comment-replies',
   register: async (server, { container }) => {
      const plugin = new CommentRepliesPlugin(container);
      plugin.register(server);
   },
};
