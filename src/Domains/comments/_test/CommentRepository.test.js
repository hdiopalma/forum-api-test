const CommentRepository = require("../CommentRepository");

describe("CommentRepository", () => {
  let commentRepository;

  beforeEach(() => {
    commentRepository = new CommentRepository();
  });

  describe("addComment", () => {
    it("should throw error when addComment is called", async () => {
      await expect(
        commentRepository.addComment(
          "This is a comment",
          "thread-123",
          "user-123"
        )
      ).rejects.toThrow("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("getCommentById", () => {
    it("should throw error when getCommentById is called", async () => {
      await expect(
        commentRepository.getCommentById("comment-123")
      ).rejects.toThrow("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("getCommentByThreadId", () => {
    it("should throw error when getCommentByThreadId is called", async () => {
      await expect(
        commentRepository.getCommentByThreadId("thread-123")
      ).rejects.toThrow("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("deleteComment", () => {
    it("should throw error when deleteComment is called", async () => {
      await expect(
        commentRepository.deleteComment("comment-123", "thread-123", "user-123")
      ).rejects.toThrow("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("verifyCommentAvailability", () => {
    it("should throw error when verifyCommentAvailability is called", async () => {
      await expect(
        commentRepository.verifyCommentAvailability("comment-123")
      ).rejects.toThrow("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });
});
