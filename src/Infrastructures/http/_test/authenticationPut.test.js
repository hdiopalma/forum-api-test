const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

describe("/authentications PUT endpoint", () => {
  let server;

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

  const addUserAndLogin = async () => {
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });

    const loginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "dicoding",
        password: "secret",
      },
    });

    const {
      data: { refreshToken },
    } = JSON.parse(loginResponse.payload);
    return refreshToken;
  };

  const sendPutRequest = async (payload) => {
    const response = await server.inject({
      method: "PUT",
      url: "/authentications",
      payload,
    });

    return JSON.parse(response.payload);
  };

  const assertResponse = (
    responseJson,
    expectedStatus,
    expectedMessage,
    accessTokenDefined
  ) => {
    expect(responseJson.status).toEqual(expectedStatus);
    if (accessTokenDefined) {
      expect(responseJson.data.accessToken).toBeDefined();
    } else {
      expect(responseJson.message).toEqual(expectedMessage);
    }
  };

  describe("when PUT /authentications", () => {
    it("should return 200 and new access token", async () => {
      const refreshToken = await addUserAndLogin();
      const responseJson = await sendPutRequest({ refreshToken });

      assertResponse(responseJson, "success", null, true);
    });

    it("should return 400 if payload does not contain a refresh token", async () => {
      const responseJson = await sendPutRequest({});

      assertResponse(
        responseJson,
        "fail",
        "must provide a refresh token",
        false
      );
    });

    it("should return 400 if refresh token is not a string", async () => {
      const responseJson = await sendPutRequest({
        refreshToken: 123, // Invalid data type
      });

      assertResponse(
        responseJson,
        "fail",
        "refresh token must be a string",
        false
      );
    });

    it("should return 400 if refresh token is invalid", async () => {
      const responseJson = await sendPutRequest({
        refreshToken: "invalid_refresh_token", // Invalid token
      });

      assertResponse(responseJson, "fail", "refresh token tidak valid", false);
    });

    it("should return 400 if refresh token is not registered in the database", async () => {
      const refreshToken = await container
        .getInstance("AuthenticationTokenManager")
        .createRefreshToken({ username: "dicoding" });

      const responseJson = await sendPutRequest({ refreshToken });

      assertResponse(
        responseJson,
        "fail",
        "refresh token tidak ditemukan di database",
        false
      );
    });
  });
});
