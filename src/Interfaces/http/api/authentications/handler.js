const AuthenticationsUseCase = require("../../../../Applications/use_case/authentications/AuthenticationsUseCase");

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  _getUseCase(UseCase) {
    return this._container.getInstance(UseCase.name);
  }

  async postAuthenticationHandler(request, h) {
    const authenticationsUseCase = this._getUseCase(AuthenticationsUseCase);
    const { accessToken, refreshToken } = await authenticationsUseCase.login(
      request.payload
    );
    return this._createResponse(h, 201, { accessToken, refreshToken });
  }

  async putAuthenticationHandler(request) {
    const authenticationsUseCase = this._getUseCase(AuthenticationsUseCase);
    const accessToken = await authenticationsUseCase.refresh(request.payload);
    return this._createResponse(null, 200, { accessToken });
  }

  async deleteAuthenticationHandler(request) {
    const authenticationsUseCase = this._getUseCase(AuthenticationsUseCase);
    await authenticationsUseCase.logout(request.payload);
    return this._createResponse(null, 200);
  }

  _createResponse(h, statusCode, data) {
    if (h) {
      const response = h.response({
        status: "success",
        data,
      });
      response.code(statusCode);
      return response;
    }
    return {
      status: "success",
      data,
    };
  }
}

module.exports = AuthenticationsHandler;
