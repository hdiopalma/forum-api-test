const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

const testCases = [
  {
    description: "should response 201 and persisted user",
    payload: {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    },
    expectedStatusCode: 201,
    expectedResponse: {
      status: "success",
      data: { addedUser: expect.any(Object) },
    },
  },
  {
    description:
      "should response 400 when request payload not contain needed property",
    payload: {
      fullname: "Dicoding Indonesia",
      password: "secret",
    },
    expectedStatusCode: 400,
    expectedResponse: {
      status: "fail",
      message:
        "tidak dapat menambah user baru karena properti yang diperlukan tidak lengkap",
    },
  },
  {
    description:
      "should response 400 when request payload not meet data type specification",
    payload: {
      username: "dicoding",
      password: "secret",
      fullname: ["Dicoding Indonesia"],
    },
    expectedStatusCode: 400,
    expectedResponse: {
      status: "fail",
      message: "tidak dapat menambah user baru kata tipe data tidak cocok",
    },
  },
  {
    description: "should response 400 when username more than 50 character",
    payload: {
      username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    },
    expectedStatusCode: 400,
    expectedResponse: {
      status: "fail",
      message:
        "cannot create a new user because the username exceeds the character limit",
    },
  },
  {
    description:
      "should response 400 when username contain restricted character",
    payload: {
      username: "dicoding indonesia",
      password: "secret",
      fullname: "Dicoding Indonesia",
    },
    expectedStatusCode: 400,
    expectedResponse: {
      status: "fail",
      message:
        "tidak dapat membuat user baru karena username mengandung karakter terlarang",
    },
  },
  {
    description: "should response 400 when username unavailable",
    payload: {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "super_secret",
    },
    setup: async () => {
      await UsersTableTestHelper.addUser({ username: "dicoding" });
    },
    expectedStatusCode: 400,
    expectedResponse: {
      status: "fail",
      message: "username tidak tersedia",
    },
  },
];

describe("/users endpoint", () => {
  let server;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  testCases.forEach(
    ({ description, payload, setup, expectedStatusCode, expectedResponse }) => {
      it(description, async () => {
        if (setup) await setup();

        const response = await server.inject({
          method: "POST",
          url: "/users",
          payload,
        });

        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(responseJson).toStrictEqual(expectedResponse);
      });
    }
  );
});
