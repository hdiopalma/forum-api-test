const routesConfig = {
   postThread: {
      method: 'POST',
      path: '/threads',
      handlerKey: 'postThreadHandler',
      options: {
         auth: 'forum_jwt',
      },
   },
   getThreadDetails: {
      method: 'GET',
      path: '/threads/{threadId}',
      handlerKey: 'getThreadDetailsHandler',
   },
};

const routes = (handler) => Object.values(routesConfig).map((route) => ({
   method: route.method,
   path: route.path,
   handler: handler[route.handlerKey],
   options: route.options,
}));

module.exports = routes;
