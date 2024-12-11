const RegisteredUser = require("../RegisteredUser");

describe("RegisteredUser entities", () => {
  const invalidPayloads = [
    {
      payload: {
        username: "dicoding",
        fullname: "Dicoding Indonesia",
      },
      expectedError: "REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY",
    },
    {
      payload: {
        id: 123,
        username: "dicoding",
        fullname: {},
      },
      expectedError: "REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION",
    },
  ];

  invalidPayloads.forEach(({ payload, expectedError }) => {
    it(`should throw error: ${expectedError}`, () => {
      // Action and Assert
      expect(() => new RegisteredUser(payload)).toThrowError(expectedError);
    });
  });

  it("should create RegisteredUser object correctly", () => {
    // Arrange
    const payload = {
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
