"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* istanbul ignore file */
var pool = require("../src/Infrastructures/database/postgres/pool"); // Define SQL queries


var QUERIES = {
  INSERT_COMMENT: "\n    INSERT INTO comments (id, content, created_at, user_id, thread_id, is_delete)\n    VALUES ($1, $2, $3, $4, $5, $6)\n    RETURNING id, content, user_id\n  ",
  SELECT_COMMENT_BY_ID: "SELECT * FROM comments WHERE id = $1",
  DELETE_ALL_COMMENTS: "DELETE FROM comments"
}; // Helper class for CommentsTable operations

var CommentsTableTestHelper =
/*#__PURE__*/
function () {
  function CommentsTableTestHelper() {
    _classCallCheck(this, CommentsTableTestHelper);
  }

  _createClass(CommentsTableTestHelper, [{
    key: "addComment",
    value: function addComment(_ref) {
      var _ref$id, id, _ref$content, content, _ref$created_at, created_at, _ref$user_id, user_id, _ref$thread_id, thread_id, _ref$is_delete, is_delete, query;

      return regeneratorRuntime.async(function addComment$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _ref$id = _ref.id, id = _ref$id === void 0 ? "comment-123" : _ref$id, _ref$content = _ref.content, content = _ref$content === void 0 ? "This is comment" : _ref$content, _ref$created_at = _ref.created_at, created_at = _ref$created_at === void 0 ? new Date() : _ref$created_at, _ref$user_id = _ref.user_id, user_id = _ref$user_id === void 0 ? "user-123" : _ref$user_id, _ref$thread_id = _ref.thread_id, thread_id = _ref$thread_id === void 0 ? "thread-123" : _ref$thread_id, _ref$is_delete = _ref.is_delete, is_delete = _ref$is_delete === void 0 ? false : _ref$is_delete;
              query = {
                text: QUERIES.INSERT_COMMENT,
                values: [id, content, created_at, user_id, thread_id, is_delete]
              };
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
    key: "getCommentById",
    value: function getCommentById(commentId) {
      var query, result;
      return regeneratorRuntime.async(function getCommentById$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = {
                text: QUERIES.SELECT_COMMENT_BY_ID,
                values: [commentId]
              };
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
      var query;
      return regeneratorRuntime.async(function cleanTable$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              query = {
                text: QUERIES.DELETE_ALL_COMMENTS
              };
              _context3.next = 3;
              return regeneratorRuntime.awrap(pool.query(query));

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }]);

  return CommentsTableTestHelper;
}();

module.exports = new CommentsTableTestHelper();