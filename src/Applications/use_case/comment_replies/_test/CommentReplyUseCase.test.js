const CommentReplyRepository = require("../../../../Domains/comment_replies/CommentReplyRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const NewCommentReply = require("../../../../Domains/comment_replies/entities/NewCommentReply");
const AddedCommentReply = require("../../../../Domains/comment_replies/entities/AddedCommentReply");
const CommentReplyUseCase = require("../CommentReplyUseCase");

describe("CommentReplyUseCase", () => {
  describe("addCommentReply", () => {
    it("should correctly orchestrate the addition of a comment reply", async () => {
      // Arrange
      const useCasePayload = { content: "This is a comment reply" };
      const useCaseThreadId = "thread-123";
      const useCaseCommentId = "comment-123";
      const useCaseCredential = "user-123";

      // Create mock dependencies
      const mockCommentReplyRepository = new CommentReplyRepository();
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();
      const mockUserRepository = new UserRepository();

      // Mock behavior
      jest
        .spyOn(mockCommentRepository, "verifyCommentAvailability")
        .mockResolvedValue();
      jest
        .spyOn(mockThreadRepository, "verifyThreadAvailability")
        .mockResolvedValue();
      jest
        .spyOn(mockUserRepository, "verifyUserAvailability")
        .mockResolvedValue();
      jest
        .spyOn(mockCommentReplyRepository, "addCommentReply")
        .mockResolvedValue(
          new AddedCommentReply({
            id: "reply-123",
            content: "This is a comment reply",
            owner: "user-123",
          })
        );

      // Instantiate use case
      const commentReplyUseCase = new CommentReplyUseCase({
        commentReplyRepository: mockCommentReplyRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        userRepository: mockUserRepository,
      });

      // Action
      const addedCommentReply = await commentReplyUseCase.addCommentReply(
        useCasePayload,
        useCaseThreadId,
        useCaseCommentId,
        useCaseCredential
      );

      // Assert
      expect(addedCommentReply).toStrictEqual(
        new AddedCommentReply({
          id: "reply-123",
          content: "This is a comment reply",
          owner: "user-123",
        })
      );
      expect(
        mockCommentRepository.verifyCommentAvailability
      ).toHaveBeenCalledWith("comment-123");
      expect(
        mockThreadRepository.verifyThreadAvailability
      ).toHaveBeenCalledWith("thread-123");
      expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith(
        "user-123"
      );
      expect(mockCommentReplyRepository.addCommentReply).toHaveBeenCalledWith(
        new NewCommentReply({
          content: useCasePayload.content,
        }).content,
        "thread-123",
        "comment-123",
        "user-123"
      );
    });
  });

describe("deleteCommentReply", () => {
  it("should correctly orchestrate the deletion of a comment reply", async () => {
    // Arrange
    const useCaseCommentReplyId = "reply-123";
    const useCaseThreadId = "thread-123";
    const useCaseCommentId = "comment-123";
    const useCaseCredential = "user-123";

    // Create mock dependencies
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();
    const mockOwnerValidator = {
      verifyOwner: jest.fn().mockResolvedValue(),
    };

    // Mock behavior
    jest
      .spyOn(mockCommentReplyRepository, "verifyCommentReplyAvailability")
      .mockResolvedValue();
    jest
      .spyOn(mockCommentReplyRepository, "getCommentReplyById")
      .mockResolvedValue({
        id: "reply-123",
        content: "Reply content",
        created_at: "2023-12-01T00:00:00Z",
        user_id: "user-123",
        thread_id: "thread-123",
        comment_id: "comment-123",
        is_delete: false,
      });
    jest
      .spyOn(mockCommentReplyRepository, "deleteCommentReply")
      .mockResolvedValue();

    // Instantiate use case
    const commentReplyUseCase = new CommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      ownerValidator: mockOwnerValidator,
    });

    // Action
    await commentReplyUseCase.deleteCommentReply(
      useCaseCommentReplyId,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );

    // Assert: Verify the behavior of mock functions and the data handling
    // Verifikasi pemanggilan untuk setiap fungsi yang di-mock

    // Verify verifyCommentReplyAvailability is called correctly
    expect(
      mockCommentReplyRepository.verifyCommentReplyAvailability
    ).toHaveBeenCalledTimes(1);
    expect(
      mockCommentReplyRepository.verifyCommentReplyAvailability
    ).toHaveBeenCalledWith("reply-123");

    // Verify getCommentReplyById is called correctly
    expect(
      mockCommentReplyRepository.getCommentReplyById
    ).toHaveBeenCalledTimes(1);
    expect(mockCommentReplyRepository.getCommentReplyById).toHaveBeenCalledWith(
      "reply-123"
    );

    // Verify the returned comment reply
    const commentReply = await mockCommentReplyRepository.getCommentReplyById(
      useCaseCommentReplyId
    );
    expect(commentReply).toBeDefined();
    expect(commentReply).toHaveProperty("id", "reply-123");
    expect(commentReply).toHaveProperty("content", "Reply content");
    expect(commentReply).toHaveProperty("created_at", "2023-12-01T00:00:00Z");
    expect(commentReply).toHaveProperty("user_id", "user-123");
    expect(commentReply).toHaveProperty("thread_id", "thread-123");
    expect(commentReply).toHaveProperty("comment_id", "comment-123");
    expect(commentReply).toHaveProperty("is_delete", false);

    // Verify verifyOwner is called with correct arguments
    expect(mockOwnerValidator.verifyOwner).toHaveBeenCalledTimes(1);
    expect(mockOwnerValidator.verifyOwner).toHaveBeenCalledWith(
      "user-123",
      "user-123",
      "comment reply"
    );

    // Verify deleteCommentReply is called correctly
    expect(mockCommentReplyRepository.deleteCommentReply).toHaveBeenCalledTimes(
      1
    );
    expect(mockCommentReplyRepository.deleteCommentReply).toHaveBeenCalledWith(
      "reply-123",
      "thread-123",
      "comment-123",
      "user-123"
    );
  });
});



});
