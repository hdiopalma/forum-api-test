const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const OwnerValidatorManager = require("../OwnerValidatorManager");

describe("OwnerValidatorManager", () => {
  let ownerValidatorManager;

  beforeEach(() => {
    ownerValidatorManager = new OwnerValidatorManager();
  });

  it("should throw an AuthorizationError if the provided credential does not belong to the owner", async () => {
    // Arrange
    const credentialId = "user-111";
    const ownerId = "user-007";

    // Action and Assert
    await expect(
      ownerValidatorManager.verifyOwner(credentialId, ownerId, "comment")
    ).rejects.toThrow(AuthorizationError);
  });

  it("should not throw any error if the provided credential matches the owner", async () => {
    // Arrange
    const credentialId = "user-111";
    const ownerId = "user-111";

    // Action and Assert
    await expect(
      ownerValidatorManager.verifyOwner(credentialId, ownerId, "comment")
    ).resolves.toBeUndefined();
  });
});
