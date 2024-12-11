const UserLogin = require("../../../Domains/users/entities/UserLogin");
const NewAuthentication = require("../../../Domains/authentications/entities/NewAuth");

class AuthenticationsUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  // Login User Use Case
  async login(useCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);

    // Verifikasi ketersediaan username
    await this._verifyUsernameAvailability(username);

    // Validasi password
    await this._validatePassword(username, password);

    // Ambil ID user berdasarkan username
    const id = await this._getUserId(username);

    // Buat token baru
    const newAuthentication = await this._generateTokens(username, id);

    // Simpan refresh token
    await this._saveRefreshToken(newAuthentication.refreshToken);

    return newAuthentication;
  }

  async _verifyUsernameAvailability(username) {
    const isUsernameAvailable =
      await this._userRepository.verifyUsernameAvailability(username);
    if (!isUsernameAvailable) {
      throw new Error("LOGIN_USE_CASE.USERNAME_NOT_AVAILABLE");
    }
  }

  async _validatePassword(username, password) {
    const encryptedPassword = await this._userRepository.getPasswordByUsername(
      username
    );
    await this._passwordHash.comparePassword(password, encryptedPassword);
  }

  async _getUserId(username) {
    return this._userRepository.getIdByUsername(username);
  }

  async _generateTokens(username, id) {
    const accessToken =
      await this._authenticationTokenManager.createAccessToken({
        username,
        id,
      });
    const refreshToken =
      await this._authenticationTokenManager.createRefreshToken({
        username,
        id,
      });
    return new NewAuthentication({ accessToken, refreshToken });
  }

  async _saveRefreshToken(refreshToken) {
    await this._authenticationRepository.addToken(refreshToken);
  }

  // Logout User Use Case
  async logout(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _validatePayload(payload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }
    if (typeof refreshToken !== "string") {
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }

  // Refresh Authentication Use Case
  async refresh(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._verifyRefreshToken(refreshToken);
    const { username, id } = await this._getDecodedPayload(refreshToken);
    return this._generateAccessToken({ username, id });
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }
    if (typeof refreshToken !== "string") {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }

  async _verifyRefreshToken(refreshToken) {
    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
  }

  async _getDecodedPayload(refreshToken) {
    return this._authenticationTokenManager.decodePayload(refreshToken);
  }

  _generateAccessToken({ username, id }) {
    return this._authenticationTokenManager.createAccessToken({ username, id });
  }
}

module.exports = AuthenticationsUseCase;
