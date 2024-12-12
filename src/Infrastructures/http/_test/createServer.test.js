const createServer = require("../createServer");

// Helper functions
const assertResponseStatus = (response, expectedStatusCode) => {
  expect(response.statusCode).toEqual(expectedStatusCode);
};

const assertJsonResponse = (response, expectedStatus, expectedMessage) => {
  const responseJson = JSON.parse(response.payload);
  expect(responseJson.status).toEqual(expectedStatus);
  expect(responseJson.message).toEqual(expectedMessage);
};

describe("HTTP server", () => {
  it("should response 404 when request unregistered route", async () => {
    const server = await createServer({});

    const response = await server.inject({
      method: "GET",
      url: "/unregisteredRoute",
    });

    assertResponseStatus(response, 404);
  });

  it("should handle server error correctly", async () => {
    const requestPayload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "super_secret",
    };
    const server = await createServer({}); // fake injection

    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: requestPayload,
    });

    assertResponseStatus(response, 500);
    assertJsonResponse(response, "error", "terjadi kegagalan pada server kami");
  });
});

describe("when GET /", () => {
  it("should return 200 and hello world", async () => {
    const server = await createServer({});
    const response = await server.inject({
      method: "GET",
      url: "/",
    });

    const responseJson = JSON.parse(response.payload);
    assertResponseStatus(response, 200);
    expect(responseJson.value).toEqual("Hello world!");
  });
});

describe('Intentional Failure', () => {
  it('should fail intentionally', async () => {
      const res = await request(app).get('/fail');
      expect(res.statusCode).toBe(500); 
  });
});

