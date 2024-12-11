const routes = (handler) => [
   {
      method: 'POST',
      path: '/authentications',
      handler: handler.postAuthenticationHandler,
      options: {
         description: 'Create authentication',
         tags: ['api'],
      },
   },
   {
      method: 'PUT',
      path: '/authentications',
      handler: handler.putAuthenticationHandler,
      options: {
         description: 'Refresh authentication',
         tags: ['api'],
      },
   },
   {
      method: 'DELETE',
      path: '/authentications',
      handler: handler.deleteAuthenticationHandler,
      options: {
         description: 'Logout user',
         tags: ['api'],
      },
   },
];

module.exports = routes;
