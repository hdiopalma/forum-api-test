const ClientError = require("../ClientError");
const AuthorizationError = require("../AuthorizationError");

describe("AuthorizationError", () => {
  it("must initialize AuthorizationError correctly", () => {
    const errorMessage = "authorization error!";
    const authorizationError = new AuthorizationError(errorMessage);

    const expectedProperties = {
      statusCode: 403,
      message: errorMessage,
      name: "AuthorizationError",
    };

    expect(authorizationError).toBeInstanceOf(AuthorizationError);
    expect(authorizationError).toBeInstanceOf(ClientError);
    expect(authorizationError).toBeInstanceOf(Error);

    Object.entries(expectedProperties).forEach(([key, value]) => {
      expect(authorizationError[key]).toStrictEqual(value);
    });
  });
});
