const CommentReplyRepository = require("../CommentReplyRepository");

describe("CommentReplyRepository", () => {
  let commentReplyRepository;

  beforeEach(() => {
    commentReplyRepository = new CommentReplyRepository();
  });

  describe("addCommentReply", () => {
    it("should throw an error when addCommentReply is called", async () => {
      const commentReplyContent = "This is a comment reply";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const ownerId = "user-123";

      await expect(
        commentReplyRepository.addCommentReply(
          commentReplyContent,
          threadId,
          commentId,
          ownerId
        )
      ).rejects.toThrow("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("verifyCommentReplyAvailability", () => {
    it("should throw an error when verifyCommentReplyAvailability is called", async () => {
      const commentReplyId = "reply-123";

      await expect(
        commentReplyRepository.verifyCommentReplyAvailability(commentReplyId)
      ).rejects.toThrow("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("getCommentReplyById", () => {
    it("should throw an error when getCommentReplyById is called", async () => {
      const commentReplyId = "reply-123";

      await expect(
        commentReplyRepository.getCommentReplyById(commentReplyId)
      ).rejects.toThrow("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("getCommentReplyByCommentId", () => {
    it("should throw an error when getCommentReplyByCommentId is called", async () => {
      const commentId = "comment-123";

      await expect(
        commentReplyRepository.getCommentReplyByCommentId(commentId)
      ).rejects.toThrow("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("deleteCommentReply", () => {
    it("should throw an error when deleteCommentReply is called", async () => {
      const commentReplyId = "reply-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const ownerId = "user-123";

      await expect(
        commentReplyRepository.deleteCommentReply(
          commentReplyId,
          threadId,
          commentId,
          ownerId
        )
      ).rejects.toThrow("COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });
});
