const AuthenticationTokenManager = require("../AuthenticationTokenManager");

describe("AuthenticationTokenManager interface", () => {
  it("should trigger an error when an unimplemented method is invoked", async () => {
    // Arrange
    const tokenManager = new AuthenticationTokenManager();
    const methodsToTest = [
      { method: tokenManager.createAccessToken, name: "createAccessToken" },
      { method: tokenManager.createRefreshToken, name: "createRefreshToken" },
      { method: tokenManager.verifyRefreshToken, name: "verifyRefreshToken" },
      { method: tokenManager.decodePayload, name: "decodePayload" },
    ];

    // Action & Assert
    for (const { method, name } of methodsToTest) {
      await expect(method.call(tokenManager, "")).rejects.toThrowError(
        `AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED`
      );
    }
  });
});
