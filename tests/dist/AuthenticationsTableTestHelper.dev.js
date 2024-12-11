"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pool = require("../src/Infrastructures/database/postgres/pool");

var QUERIES = {
  INSERT_TOKEN: "INSERT INTO authentications (token) VALUES($1)",
  SELECT_TOKEN: "SELECT token FROM authentications WHERE token = $1",
  DELETE_ALL_TOKENS: "DELETE FROM authentications"
};

var AuthenticationsTableTestHelper =
/*#__PURE__*/
function () {
  function AuthenticationsTableTestHelper(pool) {
    _classCallCheck(this, AuthenticationsTableTestHelper);

    this._pool = pool;
  }

  _createClass(AuthenticationsTableTestHelper, [{
    key: "addToken",
    value: function addToken(token) {
      var query;
      return regeneratorRuntime.async(function addToken$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                text: QUERIES.INSERT_TOKEN,
                values: [token]
              };
              _context.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "findToken",
    value: function findToken(token) {
      var query, result;
      return regeneratorRuntime.async(function findToken$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = {
                text: QUERIES.SELECT_TOKEN,
                values: [token]
              };
              _context2.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
              result = _context2.sent;
              return _context2.abrupt("return", result.rows);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
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
                text: QUERIES.DELETE_ALL_TOKENS
              };
              _context3.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }]);

  return AuthenticationsTableTestHelper;
}();

module.exports = new AuthenticationsTableTestHelper(pool);