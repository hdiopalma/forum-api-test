const Jwt = require("@hapi/jwt");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const JwtTokenManager = require("../JwtTokenManager");

describe("JwtTokenManager", () => {
  let jwtTokenManager;
  const mockJwtToken = {
    generate: jest.fn(),
  };

  beforeEach(() => {
    jwtTokenManager = new JwtTokenManager(mockJwtToken);
  });

  const assertGenerateCalledWith = (payload, key) => {
    expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, key);
  };

  const assertTokenGenerated = (token) => {
    expect(token).toEqual("mock_token");
  };

  describe("createAccessToken function", () => {
    it("correctly creates an access token", async () => {
      // Arrange
      const payload = { username: "dicoding" };
      mockJwtToken.generate.mockImplementation(() => "mock_token");

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      assertGenerateCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      assertTokenGenerated(accessToken);
    });
  });

  describe("createRefreshToken function", () => {
    it("correctly creates a refresh token", async () => {
      // Arrange
      const payload = { username: "dicoding" };
      mockJwtToken.generate.mockImplementation(() => "mock_token");

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      assertGenerateCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      assertTokenGenerated(refreshToken);
    });
  });

  describe("verifyRefreshToken function", () => {
    it("throws InvariantError when verification fails", async () => {
      // Arrange
      jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: "dicoding",
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken)
      ).rejects.toThrow(InvariantError);
    });

    it("does not throw InvariantError when the refresh token is valid", async () => {
      // Arrange
      jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: "dicoding",
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken)
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe("decodePayload function", () => {
    it("correctly decodes the payload", async () => {
      // Arrange
      jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: "dicoding",
      });

      // Action
      const { username: decodedUsername } = await jwtTokenManager.decodePayload(
        accessToken
      );

      // Assert
      expect(decodedUsername).toEqual("dicoding");
    });
  });
});
