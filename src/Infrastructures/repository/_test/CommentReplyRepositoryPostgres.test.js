const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewCommentReply = require("../../../Domains/comment_replies/entities/NewCommentReply");
const CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");
const AddedCommentReply = require("../../../Domains/comment_replies/entities/AddedCommentReply");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentReplyRepositoryPostgres", () => {
  const userId = "user-123";
  const threadId = "thread-123";
  const commentId = "comment-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      user_id: userId,
      thread_id: threadId,
    });
  });

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addCommentReply function", () => {
    const fakeIdGenerator = () => "222";

    it("should persist added comment reply", async () => {
      // Arrange
      const newCommentReply = new NewCommentReply({
        content: "This is a reply",
      });
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentReplyRepository.addCommentReply(
        newCommentReply.content,
        threadId,
        commentId,
        userId
      );

      // Assert
      const [comment] = await CommentRepliesTableTestHelper.getCommentReplyById(
        "reply-222"
      );
      expect(comment).toStrictEqual({
        id: "reply-222",
        content: "This is a reply",
        thread_id: threadId,
        comment_id: commentId,
        user_id: userId,
        is_delete: false,
        created_at: expect.any(Date), // Pastikan created_at adalah objek Date
      });
    });

    it("should return added comment reply correctly", async () => {
      // Arrange
      const newCommentReply = new NewCommentReply({
        content: "This is a reply",
      });
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedCommentReply = await commentReplyRepository.addCommentReply(
        newCommentReply.content,
        threadId,
        commentId,
        userId
      );

      // Assert
      expect(addedCommentReply).toStrictEqual(
        new AddedCommentReply({
          id: "reply-222",
          content: "This is a reply",
          owner: userId,
          thread_id: threadId,
          comment_id: commentId,
          is_delete: false,
          created_at: expect.any(Date), // Pastikan created_at ada
        })
      );
    });
  });

  describe("verifyCommentReplyAvailability function", () => {
    it("should throw NotFoundError if comment reply not found", async () => {
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentReplyRepository.verifyCommentReplyAvailability("wrong-id")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw error if comment reply exists", async () => {
      const commentReplyId = "reply-123";
      await CommentRepliesTableTestHelper.addCommentReply({
        id: commentReplyId,
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
      });

      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentReplyRepository.verifyCommentReplyAvailability(commentReplyId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getCommentReplyById function", () => {
    it("should return the correct comment reply by id with all properties validated", async () => {
      // Arrange
      const commentReplyId = "reply-444";
      const content = "This is a specific reply";

      const replyData = {
        id: commentReplyId,
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        content,
        is_delete: false,
        created_at: new Date(),
      };

      await CommentRepliesTableTestHelper.addCommentReply(replyData);

      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const commentReply = await commentReplyRepository.getCommentReplyById(
        commentReplyId
      );

      // Assert
      expect(commentReply).not.toBeNull();
      expect(commentReply).toHaveProperty("id", replyData.id);
      expect(commentReply).toHaveProperty("content", replyData.content);
      expect(commentReply).toHaveProperty("thread_id", replyData.thread_id);
      expect(commentReply).toHaveProperty("comment_id", replyData.comment_id);
      expect(commentReply).toHaveProperty("user_id", replyData.user_id);
      expect(commentReply).toHaveProperty("is_delete", replyData.is_delete);
      expect(commentReply).toHaveProperty("created_at");
      expect(new Date(commentReply.created_at).toISOString()).toEqual(
        replyData.created_at.toISOString()
      );
    });
  });


  describe("getCommentReplyByCommentId function", () => {
    it("should return all replies for a given comment id with all properties validated", async () => {
      // Arrange
      const commentReplyId1 = "reply-555";
      const commentReplyId2 = "reply-666";

      const replyData1 = {
        id: commentReplyId1,
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        content: "First reply",
        is_delete: false,
        created_at: new Date(),
      };

      const replyData2 = {
        id: commentReplyId2,
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        content: "Second reply",
        is_delete: false,
        created_at: new Date(),
      };

      await CommentRepliesTableTestHelper.addCommentReply(replyData1);
      await CommentRepliesTableTestHelper.addCommentReply(replyData2);

      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Action
      const replies = await commentReplyRepository.getCommentReplyByCommentId(
        commentId
      );

      // Assert
      expect(replies).toHaveLength(2);

      // Assert each reply deeply
      const firstReply = replies.find((reply) => reply.id === commentReplyId1);
      const secondReply = replies.find((reply) => reply.id === commentReplyId2);

      expect(firstReply).not.toBeNull();
      expect(firstReply).toHaveProperty("id", replyData1.id);
      expect(firstReply).toHaveProperty("content", replyData1.content);
      expect(firstReply).toHaveProperty("thread_id", replyData1.thread_id);
      expect(firstReply).toHaveProperty("comment_id", replyData1.comment_id);
      expect(firstReply).toHaveProperty("user_id", replyData1.user_id);
      expect(firstReply).toHaveProperty("is_delete", replyData1.is_delete);
      expect(new Date(firstReply.created_at).toISOString()).toEqual(
        replyData1.created_at.toISOString()
      );

      expect(secondReply).not.toBeNull();
      expect(secondReply).toHaveProperty("id", replyData2.id);
      expect(secondReply).toHaveProperty("content", replyData2.content);
      expect(secondReply).toHaveProperty("thread_id", replyData2.thread_id);
      expect(secondReply).toHaveProperty("comment_id", replyData2.comment_id);
      expect(secondReply).toHaveProperty("user_id", replyData2.user_id);
      expect(secondReply).toHaveProperty("is_delete", replyData2.is_delete);
      expect(new Date(secondReply.created_at).toISOString()).toStrictEqual(
        replyData2.created_at.toISOString()
      );
    });

    it("should return an empty array when no replies exist for the comment id", async () => {
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      const replies = await commentReplyRepository.getCommentReplyByCommentId(
        "non-existent-comment-id"
      );

      expect(replies).toBeInstanceOf(Array);
      expect(replies).toHaveLength(0);
    });
  });


  describe("deleteCommentReply function", () => {
    it("should soft delete comment reply correctly", async () => {
      const commentReplyId = "reply-333";

      // Add the comment reply to the table
      await CommentRepliesTableTestHelper.addCommentReply({
        id: commentReplyId,
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        content: "This is a reply",
        is_delete: false, // Default value for is_delete
        created_at: new Date(),
      });

      // Initialize the repository
      const commentReplyRepository = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      // Perform the soft delete operation
      await commentReplyRepository.deleteCommentReply(
        commentReplyId,
        threadId,
        commentId,
        userId
      );

      // Fetch the deleted reply from the table
      const [deletedReply] =
        await CommentRepliesTableTestHelper.getCommentReplyById(commentReplyId);

      // Assert that is_delete is set to true
      expect(deletedReply.is_delete).toBe(true);

      // Optionally, validate other properties if necessary
      expect(deletedReply.id).toBe(commentReplyId);
      expect(deletedReply.user_id).toBe(userId);
      expect(deletedReply.thread_id).toBe(threadId);
      expect(deletedReply.comment_id).toBe(commentId);
      expect(deletedReply.content).toBe("This is a reply");
      expect(deletedReply.created_at).toBeInstanceOf(Date);
    });
  });
});
