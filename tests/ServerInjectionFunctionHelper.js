/* istanbul ignore file */
const ServerInjectionFunctionHelper = {
   async injection(server, options) {
      return await server.inject(options);
   },

   addUserOption(payload) {
      return {
         method: 'POST',
         url: '/users',
         payload,
      };
   },

   addAuthOption(payload) {
      return {
         method: 'POST',
         url: '/authentications',
         payload,
      };
   },

   addThreadOption(payload, auth) {
      return {
         method: 'POST',
         url: '/threads',
         payload,
         headers: {
            Authorization: `Bearer ${auth}`,
         },
      };
   },

   addCommentOption(payload, auth, threadId) {
      return {
         method: 'POST',
         url: `/threads/${threadId}/comments`,
         payload,
         headers: {
            Authorization: `Bearer ${auth}`,
         },
      };
   },

   addCommentReplyOption(payload, auth, threadId, commentId) {
      return {
         method: 'POST',
         url: `/threads/${threadId}/comments/${commentId}/replies`,
         payload,
         headers: {
            Authorization: `Bearer ${auth}`,
         },
      };
   },
};

module.exports = ServerInjectionFunctionHelper;
