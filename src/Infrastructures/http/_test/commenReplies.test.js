const pool = require("../../database/postgres/pool");
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require("../../../../tests/ServerInjectionFunctionHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/replies endpoint", () => {
  const commentPayload = { content: "This is comment" };
  const threadPayload = { title: "First Thread", body: "This is first thread" };
  const userPayload = {
    username: "dicoding",
    password: "secret",
    fullname: "Dicoding Indonesia",
  };
  const notOwnerPayload = {
    username: "ichsan",
    password: "secret",
    fullname: "Ichsan Sandy",
  };
  const loginPayload = { username: "dicoding", password: "secret" };
  const notOwnerLoginPayload = { username: "ichsan", password: "secret" };
  const requestPayload = { content: "This is reply" };

  let server;

  beforeAll(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const setupData = async (userPayload, loginPayload) => {
    // Add user
    await injection(server, addUserOption(userPayload));
    // Login and get token
    const auth = await injection(server, addAuthOption(loginPayload));
    const authToken = JSON.parse(auth.payload)?.data?.accessToken;

    // Add thread
    const thread = await injection(
      server,
      addThreadOption(threadPayload, authToken)
    );
    const threadId = JSON.parse(thread.payload)?.data?.addedThread.id;

    // Add comment
    const comment = await injection(
      server,
      addCommentOption(commentPayload, authToken, threadId)
    );
    const commentId = JSON.parse(comment.payload)?.data?.addedComment.id;

    return { authToken, threadId, commentId };
  };

  const assertResponse = (
    response,
    expectedStatusCode,
    expectedStatus,
    expectedMessage
  ) => {
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    expect(responseJson.status).toEqual(expectedStatus);
    if (expectedMessage) {
      expect(responseJson.message).toEqual(expectedMessage);
    }
  };

  describe("when POST /replies", () => {
    it("should response 201 and return correct added comment reply", async () => {
      // Arrange
      const { authToken, threadId, commentId } = await setupData(
        userPayload,
        loginPayload
      );

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Assert
      assertResponse(response, 201, "success");
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe("when DELETE /replies/{commentReplyId}", () => {
    it("should response 200 with status success", async () => {
      // Arrange
      const { authToken, threadId, commentId } = await setupData(
        userPayload,
        loginPayload
      );

      // Add comment reply
      const commentReply = await injection(
        server,
        addCommentReplyOption(requestPayload, authToken, threadId, commentId)
      );
      const commentReplyId = JSON.parse(commentReply.payload)?.data?.addedReply
        .id;

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${commentReplyId}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Assert
      assertResponse(response, 200, "success");
    });

    it("should throw 403 if user not the owner", async () => {
      // Arrange
      await setupData(userPayload, loginPayload);
      await injection(server, addUserOption(notOwnerPayload));

      // Login as both owner and not owner
      const authOwner = await injection(server, addAuthOption(loginPayload));
      const authNotOwner = await injection(
        server,
        addAuthOption(notOwnerLoginPayload)
      );
      const ownerToken = JSON.parse(authOwner.payload).data.accessToken;
      const notOwnerToken = JSON.parse(authNotOwner.payload).data.accessToken;

      // Add thread and comment as owner
      const { threadId, commentId } = await setupData(
        userPayload,
        loginPayload
      );

      // Add comment reply
      const commentReply = await injection(
        server,
        addCommentReplyOption(requestPayload, ownerToken, threadId, commentId)
      );
      const commentReplyId = JSON.parse(commentReply.payload)?.data?.addedReply
        .id;

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${commentReplyId}`,
        headers: { Authorization: `Bearer ${notOwnerToken}` },
      });

      // Assert
      assertResponse(
        response,
        403,
        "fail",
        "not the owner of comment reply"
      );
    });
  });
});
