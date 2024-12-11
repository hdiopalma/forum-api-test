const bcrypt = require("bcrypt");
const AuthenticationError = require("../../../Commons/exceptions/AuthenticationError");
const BcryptEncryptionHelper = require("../BcryptPasswordHash");

describe("BcryptEncryptionHelper", () => {
  let bcryptEncryptionHelper;
  const plainPassword = "plain_password";
  const encryptedPassword = "encrypted_password";
  const saltRounds = 10; // Default salt rounds

  beforeEach(() => {
    bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt);
  });

  describe("hash function", () => {
    it("should encrypt password correctly", async () => {
      // Arrange
      jest
        .spyOn(bcrypt, "hash")
        .mockImplementation(async (password, salt) => `hashed_${password}`);

      // Act
      const result = await bcryptEncryptionHelper.hash(plainPassword);

      // Assert
      expect(result).toBe(`hashed_${plainPassword}`);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, saltRounds);
    });
  });

  describe("comparePassword function", () => {
    it("should throw AuthenticationError if password does not match", async () => {
      // Arrange
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      // Act & Assert
      await expect(
        bcryptEncryptionHelper.comparePassword(plainPassword, encryptedPassword)
      ).rejects.toThrow(AuthenticationError);
    });

    it("should not throw AuthenticationError if password matches", async () => {
      // Arrange
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      // Act & Assert
      await expect(
        bcryptEncryptionHelper.comparePassword(plainPassword, encryptedPassword)
      ).resolves.not.toThrow(AuthenticationError);
    });
  });
});
