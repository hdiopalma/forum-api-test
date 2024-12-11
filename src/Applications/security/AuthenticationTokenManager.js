class AuthenticationTokenManager {
  _throwMethodNotImplemented() {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async createRefreshToken(payload) {
    this._throwMethodNotImplemented();
  }

  async createAccessToken(payload) {
    this._throwMethodNotImplemented();
  }

  async verifyRefreshToken(token) {
    this._throwMethodNotImplemented();
  }

  async decodePayload() {
    this._throwMethodNotImplemented();
  }
}

module.exports = AuthenticationTokenManager;
