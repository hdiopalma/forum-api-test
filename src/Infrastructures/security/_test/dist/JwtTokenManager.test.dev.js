"use strict";

var Jwt = require("@hapi/jwt");

var InvariantError = require("../../../Commons/exceptions/InvariantError");

var JwtTokenManager = require("../JwtTokenManager");

describe("JwtTokenManager", function () {
  var jwtTokenManager;
  var mockJwtToken = {
    generate: jest.fn()
  };
  beforeEach(function () {
    jwtTokenManager = new JwtTokenManager(mockJwtToken);
  });

  var assertGenerateCalledWith = function assertGenerateCalledWith(payload, key) {
    expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, key);
  };

  var assertTokenGenerated = function assertTokenGenerated(token) {
    expect(token).toEqual("mock_token");
  };

  describe("createAccessToken function", function () {
    it("correctly creates an access token", function _callee() {
      var payload, accessToken;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Arrange
              payload = {
                username: "dicoding"
              };
              mockJwtToken.generate.mockImplementation(function () {
                return "mock_token";
              }); // Action

              _context.next = 4;
              return regeneratorRuntime.awrap(jwtTokenManager.createAccessToken(payload));

            case 4:
              accessToken = _context.sent;
              // Assert
              assertGenerateCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
              assertTokenGenerated(accessToken);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  });
  describe("createRefreshToken function", function () {
    it("correctly creates a refresh token", function _callee2() {
      var payload, refreshToken;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Arrange
              payload = {
                username: "dicoding"
              };
              mockJwtToken.generate.mockImplementation(function () {
                return "mock_token";
              }); // Action

              _context2.next = 4;
              return regeneratorRuntime.awrap(jwtTokenManager.createRefreshToken(payload));

            case 4:
              refreshToken = _context2.sent;
              // Assert
              assertGenerateCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
              assertTokenGenerated(refreshToken);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
  });
  describe("verifyRefreshToken function", function () {
    it("throws InvariantError when verification fails", function _callee3() {
      var accessToken;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // Arrange
              jwtTokenManager = new JwtTokenManager(Jwt.token);
              _context3.next = 3;
              return regeneratorRuntime.awrap(jwtTokenManager.createAccessToken({
                username: "dicoding"
              }));

            case 3:
              accessToken = _context3.sent;
              _context3.next = 6;
              return regeneratorRuntime.awrap(expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrow(InvariantError));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    it("does not throw InvariantError when the refresh token is valid", function _callee4() {
      var refreshToken;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // Arrange
              jwtTokenManager = new JwtTokenManager(Jwt.token);
              _context4.next = 3;
              return regeneratorRuntime.awrap(jwtTokenManager.createRefreshToken({
                username: "dicoding"
              }));

            case 3:
              refreshToken = _context4.sent;
              _context4.next = 6;
              return regeneratorRuntime.awrap(expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError));

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
  });
  describe("decodePayload function", function () {
    it("correctly decodes the payload", function _callee5() {
      var accessToken, _ref, decodedUsername;

      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // Arrange
              jwtTokenManager = new JwtTokenManager(Jwt.token);
              _context5.next = 3;
              return regeneratorRuntime.awrap(jwtTokenManager.createAccessToken({
                username: "dicoding"
              }));

            case 3:
              accessToken = _context5.sent;
              _context5.next = 6;
              return regeneratorRuntime.awrap(jwtTokenManager.decodePayload(accessToken));

            case 6:
              _ref = _context5.sent;
              decodedUsername = _ref.username;
              // Assert
              expect(decodedUsername).toEqual("dicoding");

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
});