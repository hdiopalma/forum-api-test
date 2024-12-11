const routeConfigs = [
   {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handlerKey: 'postCommentHandler',
   },
   {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}',
      handlerKey: 'deleteCommentHandler',
   },
];

const routes = (handler) => routeConfigs.map(({ method, path, handlerKey }) => ({
   method,
   path,
   handler: handler[handlerKey],
   options: {
      auth: 'forum_jwt',
   },
}));

module.exports = routes;
