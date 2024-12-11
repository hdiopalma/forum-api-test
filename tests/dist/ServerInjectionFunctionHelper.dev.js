"use strict";

/* istanbul ignore file */
var ServerInjectionFunctionHelper = {
  injection: function injection(server, options) {
    return regeneratorRuntime.async(function injection$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(server.inject(options));

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  addUserOption: function addUserOption(payload) {
    return {
      method: 'POST',
      url: '/users',
      payload: payload
    };
  },
  addAuthOption: function addAuthOption(payload) {
    return {
      method: 'POST',
      url: '/authentications',
      payload: payload
    };
  },
  addThreadOption: function addThreadOption(payload, auth) {
    return {
      method: 'POST',
      url: '/threads',
      payload: payload,
      headers: {
        Authorization: "Bearer ".concat(auth)
      }
    };
  },
  addCommentOption: function addCommentOption(payload, auth, threadId) {
    return {
      method: 'POST',
      url: "/threads/".concat(threadId, "/comments"),
      payload: payload,
      headers: {
        Authorization: "Bearer ".concat(auth)
      }
    };
  },
  addCommentReplyOption: function addCommentReplyOption(payload, auth, threadId, commentId) {
    return {
      method: 'POST',
      url: "/threads/".concat(threadId, "/comments/").concat(commentId, "/replies"),
      payload: payload,
      headers: {
        Authorization: "Bearer ".concat(auth)
      }
    };
  }
};
module.exports = ServerInjectionFunctionHelper;