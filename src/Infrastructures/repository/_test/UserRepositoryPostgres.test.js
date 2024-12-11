const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");
const pool = require("../../database/postgres/pool");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("UserRepositoryPostgres", () => {
  const fakeIdGenerator = () => "123"; // Stub for ID generator
  let userRepositoryPostgres;

  beforeAll(() => {
    userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("verifyAvailableUsername", () => {
    it("should throw InvariantError when username is not available", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError when username is available", async () => {
      await expect(
        userRepositoryPostgres.verifyAvailableUsername("dicoding")
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("verifyUsernameAvailability", () => {
    it("should throw InvariantError when username does not exist", async () => {
      await expect(
        userRepositoryPostgres.verifyUsernameAvailability("nonexistent")
      ).rejects.toThrowError(InvariantError);
    });

    it("should return true when username exists", async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
      const result = await userRepositoryPostgres.verifyUsernameAvailability(
        "dicoding"
      );
      expect(result).toBe(true);
    });
  });

  describe("verifyUserAvailability", () => {
    it("should throw InvariantError when user does not exist", async () => {
      await expect(
        userRepositoryPostgres.verifyUserAvailability("user-123")
      ).rejects.toThrowError(InvariantError);
    });

    it("should return true when user exists", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      const result = await userRepositoryPostgres.verifyUserAvailability(
        "user-123"
      );
      expect(result).toBe(true);
    });
  });

  describe("addUser", () => {
    const registerUser = new RegisterUser({
      username: "dicoding",
      password: "secret_password",
      fullname: "Dicoding Indonesia",
    });

    it("should persist user data and return registered user correctly", async () => {
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);
      const users = await UsersTableTestHelper.findUsersById("user-123");

      expect(users).toHaveLength(1);
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: "user-123",
          username: "dicoding",
          fullname: "Dicoding Indonesia",
        })
      );
    });
  });

  describe("getPasswordByUsername", () => {
    it("should return password when username exists", async () => {
      await UsersTableTestHelper.addUser({
        username: "dicoding",
        password: "secret_password",
      });

      const password = await userRepositoryPostgres.getPasswordByUsername(
        "dicoding"
      );
      expect(password).toBe("secret_password");
    });
  });

  describe("getIdByUsername", () => {
    it("should return user id when username exists", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-321",
        username: "dicoding",
      });

      const userId = await userRepositoryPostgres.getIdByUsername("dicoding");
      expect(userId).toBe("user-321");
    });
  });

  describe("getUserById", () => {
    it("should return user data when user exists", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-321",
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });

      const user = await userRepositoryPostgres.getUserById("user-321");
      expect(user).toStrictEqual({
        id: "user-321",
        username: "dicoding",
        password: "secret_password",
        fullname: "Dicoding Indonesia",
      });
    });
  });
});
