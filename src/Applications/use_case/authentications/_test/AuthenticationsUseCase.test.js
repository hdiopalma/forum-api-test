const UserRepository = require("../../../../Domains/users/UserRepository");
const AuthenticationRepository = require("../../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../../security/AuthenticationTokenManager");
const PasswordHash = require("../../../security/PasswordHash");
const AuthenticationsUseCase = require("../AuthenticationsUseCase");
const NewAuthentication = require("../../../../Domains/authentications/entities/NewAuth");

describe("AuthenticationsUseCase", () => {
  let authenticationsUseCase;
  let mockUserRepository;
  let mockAuthenticationRepository;
  let mockAuthenticationTokenManager;
  let mockPasswordHash;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationTokenManager = new AuthenticationTokenManager();
    mockPasswordHash = new PasswordHash();

    authenticationsUseCase = new AuthenticationsUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });
  });

  describe("login", () => {
    it("should throw an error if username is not available", async () => {
      // Arrange
      mockUserRepository.verifyUsernameAvailability = jest
        .fn()
        .mockResolvedValue(false); // Simulate username not available

      // Action & Assert
      await expect(
        authenticationsUseCase.login({
          username: "nonexistent_user",
          password: "secret",
        })
      ).rejects.toThrowError("LOGIN_USE_CASE.USERNAME_NOT_AVAILABLE");
      expect(mockUserRepository.verifyUsernameAvailability).toBeCalledWith(
        "nonexistent_user"
      );
    });

    it("should return authentication tokens correctly", async () => {
      // Arrange
      const useCasePayload = {
        username: "dicoding",
        password: "secret",
      };
      mockUserRepository.verifyUsernameAvailability = jest
        .fn()
        .mockResolvedValue(true);
      mockUserRepository.getPasswordByUsername = jest
        .fn()
        .mockResolvedValue("encrypted_password");
      mockPasswordHash.comparePassword = jest.fn().mockResolvedValue();
      mockUserRepository.getIdByUsername = jest
        .fn()
        .mockResolvedValue("user-123");
      mockAuthenticationTokenManager.createAccessToken = jest
        .fn()
        .mockResolvedValue("access_token");
      mockAuthenticationTokenManager.createRefreshToken = jest
        .fn()
        .mockResolvedValue("refresh_token");
      mockAuthenticationRepository.addToken = jest.fn().mockResolvedValue();

      // Action
      const actualAuthentication = await authenticationsUseCase.login(
        useCasePayload
      );

      // Assert
      expect(actualAuthentication).toStrictEqual(
        new NewAuthentication({
          accessToken: "access_token",
          refreshToken: "refresh_token",
        })
      );
      expect(mockUserRepository.verifyUsernameAvailability).toBeCalledWith(
        "dicoding"
      );
      expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(
        "dicoding"
      );
      expect(mockPasswordHash.comparePassword).toBeCalledWith(
        "secret",
        "encrypted_password"
      );
      expect(mockUserRepository.getIdByUsername).toBeCalledWith("dicoding");
      expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
        username: "dicoding",
        id: "user-123",
      });
      expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
        username: "dicoding",
        id: "user-123",
      });
      expect(mockAuthenticationRepository.addToken).toBeCalledWith(
        "refresh_token"
      );
    });
  });

  describe("logout", () => {
    it("should throw an error if the payload does not contain a refresh token", async () => {
      // Arrange
      const useCasePayload = {};

      // Act & Assert
      await expect(
        authenticationsUseCase.logout(useCasePayload)
      ).rejects.toThrowError(
        "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    });

    it("should throw an error if the refresh token is not a string", async () => {
      // Arrange
      const useCasePayload = { refreshToken: 123 };

      // Act & Assert
      await expect(
        authenticationsUseCase.logout(useCasePayload)
      ).rejects.toThrowError(
        "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });

    it("should orchestrate the deletion of the authentication", async () => {
      // Arrange
      const useCasePayload = { refreshToken: "refreshToken" };
      mockAuthenticationRepository.checkAvailabilityToken = jest
        .fn()
        .mockResolvedValue();
      mockAuthenticationRepository.deleteToken = jest.fn().mockResolvedValue();

      // Act
      await authenticationsUseCase.logout(useCasePayload);

      // Assert
      expect(
        mockAuthenticationRepository.checkAvailabilityToken
      ).toHaveBeenCalledWith("refreshToken");
      expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
        "refreshToken"
      );
    });
  });

  describe("refresh", () => {
    it("should throw an error if payload does not contain a refresh token", async () => {
      // Arrange
      const useCasePayload = {};

      // Act & Assert
      await expect(
        authenticationsUseCase.refresh(useCasePayload)
      ).rejects.toThrowError(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    });

    it("should throw an error if the refresh token is not a string", async () => {
      // Arrange
      const useCasePayload = { refreshToken: 1 };

      // Act & Assert
      await expect(
        authenticationsUseCase.refresh(useCasePayload)
      ).rejects.toThrowError(
        "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });

    it("should orchestrate the refresh authentication action", async () => {
      // Arrange
      const useCasePayload = { refreshToken: "some_refresh_token" };
      mockAuthenticationTokenManager.verifyRefreshToken = jest
        .fn()
        .mockResolvedValue();
      mockAuthenticationRepository.checkAvailabilityToken = jest
        .fn()
        .mockResolvedValue();
      mockAuthenticationTokenManager.decodePayload = jest
        .fn()
        .mockResolvedValue({ username: "dicoding", id: "user-123" });
      mockAuthenticationTokenManager.createAccessToken = jest
        .fn()
        .mockResolvedValue("some_new_access_token");

      // Act
      const accessToken = await authenticationsUseCase.refresh(useCasePayload);

      // Assert
      expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(
        "some_refresh_token"
      );
      expect(
        mockAuthenticationRepository.checkAvailabilityToken
      ).toBeCalledWith("some_refresh_token");
      expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
        "some_refresh_token"
      );
      expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
        username: "dicoding",
        id: "user-123",
      });
      expect(accessToken).toStrictEqual("some_new_access_token");
    });
  });
});
