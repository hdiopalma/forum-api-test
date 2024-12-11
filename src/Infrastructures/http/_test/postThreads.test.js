const {
  addUserAndGetAccessToken,
} = require("../../../../tests/UtilsThreadHelperTest");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint POST", () => {
  let server;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  // Fungsi pembantu untuk memeriksa respons
  const checkResponse = (response, expectedStatusCode, expectedJson) => {
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    Object.keys(expectedJson).forEach((key) => {
      expect(responseJson[key]).toEqual(expectedJson[key]);
    });
  };

  it("should respond 201 and return correct added thread", async () => {
    const requestPayload = {
      title: "First Thread",
      body: "This is first thread",
    };

    const userPayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    const loginPayload = {
      username: "dicoding",
      password: "secret",
    };

    const accessToken = await addUserAndGetAccessToken(
      server,
      userPayload,
      loginPayload
    );

    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    checkResponse(response, 201, {
      status: "success",
      data: {
        addedThread: expect.anything(),
      },
    });
  });

  it("should respond 401 if no authorization", async () => {
    const requestPayload = {
      title: "First Thread",
      body: "This is first thread",
    };
    const accessToken = "wrongtoken";

    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    checkResponse(response, 401, {
      error: "Unauthorized",
    });
  });

  it("should respond 400 if bad payload", async () => {
    const requestPayload = {
      title: "First Thread",
    };

    const userPayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    const loginPayload = {
      username: "dicoding",
      password: "secret",
    };

    const accessToken = await addUserAndGetAccessToken(
      server,
      userPayload,
      loginPayload
    );

    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    checkResponse(response, 400, {
      status: "fail",
      message: "tidak dapat membuat thread baru karena payload tidak tepat",
    });
  });
});
