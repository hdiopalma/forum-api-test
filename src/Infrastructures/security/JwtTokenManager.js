const AuthenticationTokenManager = require("../../Applications/security/AuthenticationTokenManager");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
    this._accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    this._refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
  }

  async createAccessToken(payload) {
    return this._generateToken(payload, this._accessTokenKey);
  }

  async createRefreshToken(payload) {
    return this._generateToken(payload, this._refreshTokenKey);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._decodeToken(token);
      this._verifyToken(artifacts, this._refreshTokenKey);
    } catch (error) {
      throw new InvariantError("refresh token tidak valid");
    }
  }

  async decodePayload(token) {
    const artifacts = this._decodeToken(token);
    return artifacts.decoded.payload;
  }

  _generateToken(payload, key) {
    return this._jwt.generate(payload, key);
  }

  _decodeToken(token) {
    return this._jwt.decode(token);
  }

  _verifyToken(artifacts, key) {
    this._jwt.verify(artifacts, key);
  }
}

module.exports = JwtTokenManager;
