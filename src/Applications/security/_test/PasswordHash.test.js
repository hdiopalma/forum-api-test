const EncryptionHelper = require("../PasswordHash");

describe("EncryptionHelper interface", () => {
  let encryptionHelper;
  const methodsToTest = [
    { method: "hash", args: ["dummy_password"] },
    { method: "comparePassword", args: ["plain", "encrypted"] },
  ];

  beforeEach(() => {
    encryptionHelper = new EncryptionHelper();
  });

  methodsToTest.forEach(({ method, args }) => {
    describe(`${method} method`, () => {
      it("must raise an error when invoked", async () => {
        await expect(encryptionHelper[method](...args)).rejects.toThrowError(
          "PASSWORD_HASH.METHOD_NOT_IMPLEMENTED"
        );
      });
    });
  });
});
