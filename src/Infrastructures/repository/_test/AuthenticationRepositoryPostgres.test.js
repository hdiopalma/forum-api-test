const InvariantError = require("../../../Commons/exceptions/InvariantError");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const pool = require("../../database/postgres/pool");
const AuthenticationRepositoryPostgres = require("../AuthenticationRepositoryPostgres");

describe("AuthenticationRepositoryPostgres", () => {
  let authenticationRepository;
  const testToken = "testToken";

  beforeAll(() => {
    authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const testAddToken = async () => {
    await authenticationRepository.addToken(testToken);
    const tokens = await AuthenticationsTableTestHelper.findToken(testToken);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].token).toBe(testToken);
  };

  const testCheckAvailabilityToken = async (shouldThrow) => {
    if (shouldThrow) {
      await expect(
        authenticationRepository.checkAvailabilityToken(testToken)
      ).rejects.toThrow(InvariantError);
    } else {
      await AuthenticationsTableTestHelper.addToken(testToken);
      await expect(
        authenticationRepository.checkAvailabilityToken(testToken)
      ).resolves.not.toThrow(InvariantError);
    }
  };

  const testDeleteToken = async () => {
    await AuthenticationsTableTestHelper.addToken(testToken);
    await authenticationRepository.deleteToken(testToken);
    const tokens = await AuthenticationsTableTestHelper.findToken(testToken);
    expect(tokens).toHaveLength(0);
  };

  describe("addToken function", () => {
    it("should successfully add token to database", testAddToken);
  });

  describe("checkAvailabilityToken function", () => {
    it("should throw InvariantError if token is not available", () =>
      testCheckAvailabilityToken(true));
    it("should not throw InvariantError if token is available", () =>
      testCheckAvailabilityToken(false));
  });

  describe("deleteToken function", () => {
    it("should successfully delete token from database", testDeleteToken);
  });
});
