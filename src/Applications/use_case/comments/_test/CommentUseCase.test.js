const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const OwnerValidator = require("../../../security/OwnerValidator");
const NewComment = require("../../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../../Domains/comments/entities/AddedComment");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  describe("addComment", () => {
    it("should orchestrate adding a comment correctly", async () => {
      // Arrange
      const useCasePayload = {
        content: "This is a comment",
      };
      const useCaseThreadId = "thread-123";
      const useCaseCredential = "user-123";

      /** creating dependencies for use case */
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();
      const mockUserRepository = new UserRepository();

      /** mocking necessary functions */
      mockThreadRepository.verifyThreadAvailability = jest.fn(() =>
        Promise.resolve()
      );
      mockUserRepository.verifyUserAvailability = jest.fn(() =>
        Promise.resolve()
      );
      mockCommentRepository.addComment = jest.fn(() =>
        Promise.resolve(
          new AddedComment({
            id: "comment-123",
            content: "This is a comment",
            owner: "user-123",
          })
        )
      );

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });

      // Action
      const addedComment = await commentUseCase.addComment(
        useCasePayload,
        useCaseThreadId,
        useCaseCredential
      );

      // Assert
      expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
        "thread-123"
      );
      expect(mockUserRepository.verifyUserAvailability).toBeCalledWith(
        "user-123"
      );
      expect(mockCommentRepository.addComment).toBeCalledWith(
        new NewComment(useCasePayload).content,
        "thread-123",
        "user-123"
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "This is a comment",
          owner: "user-123",
        })
      );
    });
  });

  describe("deleteComment", () => {
    it("should orchestrate deleting a comment correctly", async () => {
      // Arrange
      const useCaseCommentId = "comment-212";
      const useCaseThreadId = "thread-212";
      const useCaseCredential = "user-212";

      /** creating dependencies for use case */
      const mockCommentRepository = new CommentRepository();
      const mockOwnerValidator = new OwnerValidator();

      /** mocking necessary functions */
      mockCommentRepository.verifyCommentAvailability = jest.fn(() =>
        Promise.resolve()
      );
      mockCommentRepository.getCommentById = jest.fn(() =>
        Promise.resolve({
          id: "comment-212",
          content: "This is a comment",
          created_at: "2024-12-01T10:00:00Z",
          user_id: "user-212",
          thread_id: "thread-212",
          is_delete: false,
        })
      );
      mockOwnerValidator.verifyOwner = jest.fn(() => Promise.resolve());
      mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

      /** creating use case instance */
      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: new ThreadRepository(),
        userRepository: new UserRepository(),
        ownerValidator: mockOwnerValidator,
      });

      // Action
      await commentUseCase.deleteComment(
        useCaseCommentId,
        useCaseThreadId,
        useCaseCredential
      );

      // Assert
      expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
        "comment-212"
      );
      expect(mockCommentRepository.getCommentById).toBeCalledWith(
        "comment-212"
      );

      // Additional Assertion: Verify return value of getCommentById
      const commentDetails = await mockCommentRepository.getCommentById(
        "comment-212"
      );
      expect(commentDetails).toStrictEqual({
        id: "comment-212",
        content: "This is a comment",
        created_at: "2024-12-01T10:00:00Z",
        user_id: "user-212",
        thread_id: "thread-212",
        is_delete: false,
      });

      expect(mockOwnerValidator.verifyOwner).toBeCalledWith(
        "user-212",
        "user-212",
        "comment"
      );
      expect(mockCommentRepository.deleteComment).toBeCalledWith(
        "comment-212",
        "thread-212",
        "user-212"
      );
    });
  });
});
