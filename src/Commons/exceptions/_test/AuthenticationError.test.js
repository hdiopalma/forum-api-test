const AuthenticationError = require("../AuthenticationError");
const ClientError = require("../ClientError");

describe("AuthenticationError", () => {
  it("must be instantiated correctly with appropriate properties", () => {
    const authenticationError = new AuthenticationError(
      "authentication error!"
    );

    expect(authenticationError).toBeInstanceOf(AuthenticationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);

    expect(authenticationError.statusCode).toBe(401);
    expect(authenticationError.message).toBe("authentication error!");
    expect(authenticationError.name).toBe("AuthenticationError");
  });
});
