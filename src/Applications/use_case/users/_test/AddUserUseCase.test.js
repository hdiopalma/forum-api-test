const RegisterUser = require("../../../../Domains/users/entities/RegisterUser");
const RegisteredUser = require("../../../../Domains/users/entities/RegisteredUser");
const UserRepository = require("../../../../Domains/users/UserRepository");
const PasswordHash = require("../../../security/PasswordHash");
const AddUserUseCase = require("../AddUserUseCase");

describe("AddUserUseCase", () => {
  it("must correctly orchestrate the add user process", async () => {
    // Arrange: Prepare input payload and mock objects
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    const mockRegisteredUser = new RegisteredUser({
      id: "user-123",
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    // Mocking repository and security functions
    mockUserRepository.verifyAvailableUsername = jest.fn().mockResolvedValue();
    mockPasswordHash.hash = jest.fn().mockResolvedValue("encrypted_password");
    mockUserRepository.addUser = jest.fn().mockResolvedValue(
      new RegisteredUser({
        id: "user-123",
        username: "dicoding",
        fullname: "Dicoding Indonesia",
      })
    );

    // Creating use case instance with dependencies
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Act: Execute the use case with the payload
    const registeredUser = await addUserUseCase.execute(useCasePayload);

    // Assert: Verify the results
    expect(registeredUser).toStrictEqual(mockRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(
      useCasePayload.username
    );
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: "encrypted_password",
        fullname: useCasePayload.fullname,
      })
    );
  });
});
