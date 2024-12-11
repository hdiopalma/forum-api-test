const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

describe("/authentications POST endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const addUser = async (server) => {
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });
  };

  const loginRequest = async (server, requestPayload) => {
    return server.inject({
      method: "POST",
      url: "/authentications",
      payload: requestPayload,
    });
  };

  const createServerAndLogin = async (requestPayload) => {
    const server = await createServer(container);
    await addUser(server);
    return loginRequest(server, requestPayload);
  };

  const expectResponse = (
    response,
    expectedStatusCode,
    expectedStatus,
    expectedMessage,
    expectedData = {}
  ) => {
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(responseJson.status).toEqual(expectedStatus);
    if (expectedMessage) {
      expect(responseJson.message).toEqual(expectedMessage);
    }
    if (expectedData) {
      Object.keys(expectedData).forEach((key) => {
        expect(responseJson.data[key]).toBeDefined();
      });
    }
  };

  describe("when POST /authentications", () => {
    it("should respond with 201 and new authentication", async () => {
      const requestPayload = {
        username: "dicoding",
        password: "secret",
      };

      const response = await createServerAndLogin(requestPayload);
      expectResponse(response, 201, "success", null, {
        accessToken: undefined,
        refreshToken: undefined,
      });
    });

    it("should respond with 400 if username not found", async () => {
      const requestPayload = {
        username: "dicoding",
        password: "secret",
      };

      const server = await createServer(container);
      const response = await loginRequest(server, requestPayload);
      expectResponse(response, 400, "fail", "username tidak ditemukan");
    });

    it("should respond with 401 if password is wrong", async () => {
      const requestPayload = {
        username: "dicoding",
        password: "wrong_password",
      };

      const response = await createServerAndLogin(requestPayload);
      expectResponse(
        response,
        401,
        "fail",
        "Otentikasi yang diberikan tidak benar"
      );
    });

    it("should respond with 400 if login payload does not contain the required properties", async () => {
      const requestPayload = {
        username: "dicoding",
      };

      const server = await createServer(container);
      const response = await loginRequest(server, requestPayload);
      expectResponse(
        response,
        400,
        "fail",
        "must provide both username and password"
      );
    });

    it("should respond with 400 if login payload contains wrong data type", async () => {
      const requestPayload = {
        username: 123,
        password: "secret",
      };

      const server = await createServer(container);
      const response = await loginRequest(server, requestPayload);
      expectResponse(
        response,
        400,
        "fail",
        "username and password must be strings"
      );
    });
  });
});
