const RegisterUser = require("../RegisterUser");

const testCases = [
  {
    description: "throw error when payload did not contain needed property",
    payload: { username: "abc", password: "abc" },
    expectedError: "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY",
  },
  {
    description:
      "throw error when payload did not meet data type specification",
    payload: { username: 123, fullname: true, password: "abc" },
    expectedError: "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION",
  },
  {
    description: "throw error when username contains more than 50 character",
    payload: {
      username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding",
      fullname: "Dicoding Indonesia",
      password: "abc",
    },
    expectedError: "REGISTER_USER.USERNAME_LIMIT_CHAR",
  },
  {
    description: "throw error when username contains restricted character",
    payload: { username: "dico ding", fullname: "dicoding", password: "abc" },
    expectedError: "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER",
  },
];

describe("RegisterUser entity", () => {
  testCases.forEach(({ description, payload, expectedError }) => {
    it(description, () => {
      expect(() => new RegisterUser(payload)).toThrowError(expectedError);
    });
  });

  it("should create registerUser object correctly", () => {
    // Arrange
    const payload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "abc",
    };

    // Action
    const { username, fullname, password } = new RegisterUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
