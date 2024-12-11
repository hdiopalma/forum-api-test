const OwnerValidator = require("../OwnerValidator");

describe("OwnerValidator interface", () => {
  it("Invoking an unimplemented method should cause an error to be thrown", async () => {
    // Arrange

    const ownerValidator = new OwnerValidator();

    // Action & Assert
    await expect(ownerValidator.verifyOwner("", "", "")).rejects.toThrowError(
      "OWNER_VALIDATOR.METHOD_NOT_IMPLEMENTED"
    );
  });
});
