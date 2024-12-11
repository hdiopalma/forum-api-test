const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

// Helper function for performing DELETE /authentications request
const deleteAuthentication = async (server, payload) => {
  return server.inject({
    method: "DELETE",
    url: "/authentications",
    payload,
  });
};

// Helper function for asserting responses
const assertResponse = (
  response,
  expectedStatusCode,
  expectedStatus,
  expectedMessage
) => {
  const responseJson = JSON.parse(response.payload);
  expect(response.statusCode).toEqual(expectedStatusCode);
  expect(responseJson.status).toEqual(expectedStatus);
  if (expectedMessage !== undefined) {
    expect(responseJson.message).toEqual(expectedMessage);
  }
};

describe("/authentications DELETE endpoint", () => {
  let server;

  // Setting up the server once for all tests
  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when DELETE /authentications", () => {
    it("should respond with 200 if refresh token is valid", async () => {
      // Arrange
      const refreshToken = "refresh_token_valid";
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      // Action
      const response = await deleteAuthentication(server, { refreshToken });

      // Assert
      assertResponse(response, 200, "success");
    });

    it("should respond with 400 if refresh token is not registered in the database", async () => {
      // Arrange
      const refreshToken = "unregistered_refresh_token";

      // Action
      const response = await deleteAuthentication(server, { refreshToken });

      // Assert
      assertResponse(
        response,
        400,
        "fail",
        "refresh token tidak ditemukan di database"
      );
    });

    it("should respond with 400 if payload does not contain a refresh token", async () => {
      // Action
      const response = await deleteAuthentication(server, {});

      // Assert
      assertResponse(response, 400, "fail", "must provide a refresh token");
    });

    it("should respond with 400 if refresh token is not a string", async () => {
      // Action
      const response = await deleteAuthentication(server, {
        refreshToken: 123,
      });

      // Assert
      assertResponse(response, 400, "fail", "refresh token must be a string");
    });
  });
});
