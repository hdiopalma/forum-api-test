const NewAuth = require("../NewAuth");

describe("NewAuth entities", () => {
  const createNewAuth = (payload) => () => new NewAuth(payload);

  it("throws an error when payload lacks required properties", () => {
    const payload = { accessToken: "accessToken" };
    expect(createNewAuth(payload)).toThrowError(
      "NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws an error when payload properties have incorrect data types", () => {
    const payload = { accessToken: "accessToken", refreshToken: 1234 };
    expect(createNewAuth(payload)).toThrowError(
      "NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("successfully creates NewAuth entity with valid payload", () => {
    const payload = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };
    const newAuth = new NewAuth(payload);

    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
