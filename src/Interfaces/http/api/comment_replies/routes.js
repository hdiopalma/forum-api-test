const routesConfig = {
   postCommentReply: {
      method: 'POST',
      path: '/threads/{threadId}/comments/{commentId}/replies',
      handlerKey: 'postCommentReplyHandler',
   },
   deleteCommentReply: {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}/replies/{commentReplyId}',
      handlerKey: 'deleteCommentReplyHandler',
   },
};

const routes = (handler) => Object.values(routesConfig).map((route) => ({
   method: route.method,
   path: route.path,
   handler: handler[route.handlerKey],
   options: {
      auth: 'forum_jwt',
   },
}));

module.exports = routes;
