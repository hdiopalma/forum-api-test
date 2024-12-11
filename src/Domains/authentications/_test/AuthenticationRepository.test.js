const AuthenticationRepository = require("../AuthenticationRepository");

describe("AuthenticationRepository interface", () => {
  let authenticationRepository;

  beforeEach(() => {
    // Arrange
    authenticationRepository = new AuthenticationRepository();
  });

  const methods = [
    { name: "addToken", message: "Method addToken is not implemented" },
    {
      name: "checkAvailabilityToken",
      message: "Method checkAvailabilityToken is not implemented",
    },
    { name: "deleteToken", message: "Method deleteToken is not implemented" },
  ];

  methods.forEach(({ name, message }) => {
    it(`should throw an error when ${name} is invoked without implementation`, async () => {
      // Action & Assert
      await expect(authenticationRepository[name]("")).rejects.toThrowError(
        `AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED`
      );
    });
  });
});
