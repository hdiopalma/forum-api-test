"use strict";

/* istanbul ignore file */
var pool = require("../src/Infrastructures/database/postgres/pool"); // Define query text as constants


var QUERY_TEXT = {
  INSERT_USER: "INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4)",
  SELECT_USER_BY_ID: "SELECT * FROM users WHERE id = $1",
  DELETE_ALL_USERS: "DELETE FROM users"
};
var UsersTableTestHelper = {
  addUser: function addUser(_ref) {
    var _ref$id, id, _ref$username, username, _ref$password, password, _ref$fullname, fullname;

    return regeneratorRuntime.async(function addUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref$id = _ref.id, id = _ref$id === void 0 ? "user-123" : _ref$id, _ref$username = _ref.username, username = _ref$username === void 0 ? "dicoding" : _ref$username, _ref$password = _ref.password, password = _ref$password === void 0 ? "secret" : _ref$password, _ref$fullname = _ref.fullname, fullname = _ref$fullname === void 0 ? "Dicoding Indonesia" : _ref$fullname;
            _context.next = 3;
            return regeneratorRuntime.awrap(this._executeQuery(QUERY_TEXT.INSERT_USER, [id, username, password, fullname]));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  },
  findUsersById: function findUsersById(id) {
    var result;
    return regeneratorRuntime.async(function findUsersById$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(this._executeQuery(QUERY_TEXT.SELECT_USER_BY_ID, [id]));

          case 2:
            result = _context2.sent;
            return _context2.abrupt("return", result.rows);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, null, this);
  },
  cleanTable: function cleanTable() {
    return regeneratorRuntime.async(function cleanTable$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(this._executeQuery(QUERY_TEXT.DELETE_ALL_USERS));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, null, this);
  },
  // Helper function to execute queries
  _executeQuery: function _executeQuery(text) {
    var values,
        query,
        _args4 = arguments;
    return regeneratorRuntime.async(function _executeQuery$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            values = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : [];
            query = {
              text: text,
              values: values
            };
            _context4.next = 4;
            return regeneratorRuntime.awrap(pool.query(query));

          case 4:
            return _context4.abrupt("return", _context4.sent);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    });
  }
};
module.exports = UsersTableTestHelper;