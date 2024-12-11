const {
  injection,
  addUserOption,
  addThreadOption,
  addCommentOption,
  addCommentReplyOption,
  addAuthOption,
} = require("../../../../tests/UtilsThreadHelperTest");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint GET", () => {
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

  it("should display the right thread details", async () => {
    const commentPayload = {
      content: "This is comment",
    };

    const threadPayload = {
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

    const replyPayload = {
      content: "This is reply",
    };

    await injection(server, addUserOption(userPayload));
    const auth = await injection(server, addAuthOption(loginPayload));
    const accessToken = JSON.parse(auth.payload)?.data?.accessToken;

    const thread = await injection(
      server,
      addThreadOption(threadPayload, accessToken)
    );
    const threadId = JSON.parse(thread.payload)?.data?.addedThread.id;

    const comment = await injection(
      server,
      addCommentOption(commentPayload, accessToken, threadId)
    );
    const commentId = JSON.parse(comment.payload)?.data?.addedComment.id;

    await injection(
      server,
      addCommentReplyOption(replyPayload, accessToken, threadId, commentId)
    );

    const response = await server.inject({
      method: "GET",
      url: `/threads/${threadId}`,
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(200);
    expect(responseJson.status).toEqual("success");
    expect(responseJson.data.thread).toBeDefined();
  });
});
