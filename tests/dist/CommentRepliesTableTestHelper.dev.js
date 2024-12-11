"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* istanbul ignore file */
var pool = require("../src/Infrastructures/database/postgres/pool"); // SQL queries as constants


var QUERIES = {
  INSERT_COMMENT_REPLY: {
    text: "INSERT INTO comment_replies (id, content, created_at, user_id, thread_id, comment_id, is_delete) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, user_id"
  },
  SELECT_COMMENT_REPLY_BY_ID: {
    text: "SELECT * FROM comment_replies WHERE id = $1"
  },
  DELETE_ALL_COMMENT_REPLIES: "DELETE FROM comment_replies"
};

var CommentRepliesTableTestHelper =
/*#__PURE__*/
function () {
  function CommentRepliesTableTestHelper() {
    _classCallCheck(this, CommentRepliesTableTestHelper);
  }

  _createClass(CommentRepliesTableTestHelper, null, [{
    key: "addCommentReply",
    value: function addCommentReply(_ref) {
      var _ref$id, id, _ref$content, content, _ref$created_at, created_at, _ref$user_id, user_id, _ref$thread_id, thread_id, _ref$comment_id, comment_id, _ref$is_delete, is_delete, query;

      return regeneratorRuntime.async(function addCommentReply$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _ref$id = _ref.id, id = _ref$id === void 0 ? "reply-123" : _ref$id, _ref$content = _ref.content, content = _ref$content === void 0 ? "This is reply" : _ref$content, _ref$created_at = _ref.created_at, created_at = _ref$created_at === void 0 ? new Date() : _ref$created_at, _ref$user_id = _ref.user_id, user_id = _ref$user_id === void 0 ? "user-123" : _ref$user_id, _ref$thread_id = _ref.thread_id, thread_id = _ref$thread_id === void 0 ? "thread-123" : _ref$thread_id, _ref$comment_id = _ref.comment_id, comment_id = _ref$comment_id === void 0 ? "comment-123" : _ref$comment_id, _ref$is_delete = _ref.is_delete, is_delete = _ref$is_delete === void 0 ? false : _ref$is_delete;
              query = _objectSpread({}, QUERIES.INSERT_COMMENT_REPLY, {
                values: [id, content, created_at, user_id, thread_id, comment_id, is_delete]
              });
              _context.next = 4;
              return regeneratorRuntime.awrap(pool.query(query));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "getCommentReplyById",
    value: function getCommentReplyById(id) {
      var query, result;
      return regeneratorRuntime.async(function getCommentReplyById$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = _objectSpread({}, QUERIES.SELECT_COMMENT_REPLY_BY_ID, {
                values: [id]
              });
              _context2.next = 3;
              return regeneratorRuntime.awrap(pool.query(query));

            case 3:
              result = _context2.sent;
              return _context2.abrupt("return", result.rows);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "cleanTable",
    value: function cleanTable() {
      return regeneratorRuntime.async(function cleanTable$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(pool.query(QUERIES.DELETE_ALL_COMMENT_REPLIES));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }]);

  return CommentRepliesTableTestHelper;
}();

module.exports = CommentRepliesTableTestHelper;