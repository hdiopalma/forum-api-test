const UserRepository = require("../UserRepository");

describe("UserRepository interface", () => {
  const userRepository = new UserRepository();
  const methodsToTest = [
    { method: "addUser", args: [{}] },
    { method: "verifyAvailableUsername", args: [""] },
    { method: "verifyUsernameAvailability", args: [""] },
    { method: "verifyUserAvailability", args: [""] },
    { method: "getPasswordByUsername", args: [""] },
    { method: "getIdByUsername", args: [""] },
    { method: "getUserById", args: [""] },
  ];

  methodsToTest.forEach(({ method, args }) => {
    it(`should throw an error when invoking ${method} method`, async () => {
      await expect(userRepository[method](...args)).rejects.toThrowError(
        "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED"
      );
    });
  });
});
