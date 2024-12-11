"use strict";

/* istanbul ignore file */
var pool = require("../src/Infrastructures/database/postgres/pool");

var QUERIES = {
  INSERT_THREAD: "\n    INSERT INTO threads (id, title, body, created_at, user_id)\n    VALUES ($1, $2, $3, $4, $5)\n    RETURNING id, title, user_id\n  ",
  SELECT_THREAD_BY_ID: "\n    SELECT * FROM threads WHERE id = $1\n  ",
  DELETE_ALL_THREADS: "\n    DELETE FROM threads\n  "
};
var ThreadTableTestHelper = {
  addThread: function addThread(_ref) {
    var _ref$id, id, _ref$title, title, _ref$body, body, _ref$created_at, created_at, _ref$user_id, user_id, values, query;

    return regeneratorRuntime.async(function addThread$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref$id = _ref.id, id = _ref$id === void 0 ? "thread-123" : _ref$id, _ref$title = _ref.title, title = _ref$title === void 0 ? "Thread helper" : _ref$title, _ref$body = _ref.body, body = _ref$body === void 0 ? "This is helper thread" : _ref$body, _ref$created_at = _ref.created_at, created_at = _ref$created_at === void 0 ? new Date() : _ref$created_at, _ref$user_id = _ref.user_id, user_id = _ref$user_id === void 0 ? "user-123" : _ref$user_id;
            values = [id, title, body, created_at, user_id];
            query = {
              text: QUERIES.INSERT_THREAD,
              values: values
            };
            _context.next = 5;
            return regeneratorRuntime.awrap(pool.query(query));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  findThreadById: function findThreadById(threadId) {
    var values, query, result;
    return regeneratorRuntime.async(function findThreadById$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            values = [threadId];
            query = {
              text: QUERIES.SELECT_THREAD_BY_ID,
              values: values
            };
            _context2.next = 4;
            return regeneratorRuntime.awrap(pool.query(query));

          case 4:
            result = _context2.sent;
            return _context2.abrupt("return", result.rows);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  cleanTable: function cleanTable() {
    return regeneratorRuntime.async(function cleanTable$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(pool.query(QUERIES.DELETE_ALL_THREADS));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};
module.exports = ThreadTableTestHelper;