const UserLogin = require("../UserLogin");

describe("UserLogin entities", () => {
  const createUserLogin = (payload) => () => new UserLogin(payload);

  it("throws an error if the payload is missing required properties", () => {
    // Arrange
    const payload = {
      username: "dicoding",
    };

    // Action & Assert
    expect(createUserLogin(payload)).toThrowError(
      "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws an error if the payload does not match the data type requirements", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      password: 12345,
    };

    // Action & Assert
    expect(createUserLogin(payload)).toThrowError(
      "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("successfully creates a UserLogin entity when valid payload is provided", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      password: "12345",
    };

    // Action
    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
