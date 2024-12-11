const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const CommentReplyRepository = require("../../../../Domains/comment_replies/CommentReplyRepository");
const AddedThread = require("../../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../../Domains/threads/entities/NewThread");
const ThreadDetails = require("../../../../Domains/threads/entities/ThreadDetails");
const CommentDetails = require("../../../../Domains/comments/entities/CommentDetails");
const CommentReplyDetails = require("../../../../Domains/comment_replies/entities/CommentReplyDetails");
const ThreadUseCase = require("../ThreadUseCase");

describe("ThreadUseCase", () => {
  describe("addThreadUseCase", () => {
    it("should orchestrate the add thread action correctly", async () => {
      // Arrange
      const useCasePayload = {
        title: "A thread title",
        body: "Thread body content",
      };
      const useCaseCredential = "user-123";

      const mockThreadRepository = new ThreadRepository();
      const mockUserRepository = new UserRepository();
      const mockCommentRepository = new CommentRepository();
      const mockCommentReplyRepository = new CommentReplyRepository();

      // Mock dependencies
      mockThreadRepository.addNewThread = jest.fn().mockResolvedValue(
        new AddedThread({
          id: "thread-123",
          title: "A thread title",
          owner: "user-123",
        })
      );

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
        commentRepository: mockCommentRepository,
        commentReplyRepository: mockCommentReplyRepository,
      });

      // Action
      const addedThread = await threadUseCase.addThread(
        useCasePayload,
        useCaseCredential
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "A thread title",
          owner: "user-123",
        })
      );
      expect(mockThreadRepository.addNewThread).toHaveBeenCalledTimes(1);
      expect(mockThreadRepository.addNewThread).toHaveBeenCalledWith(
        new NewThread({
          title: "A thread title",
          body: "Thread body content",
        }),
        "user-123"
      );
    });
  });

describe("getDetailsThread", () => {
  it("should orchestrate the get thread details correctly and verify all data entries", async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    // Simulate getting thread details
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue({
      id: "thread-123",
      title: "Title for thread",
      body: "This is body for thread",
      created_at: new Date("2023-01-01T00:00:00.000Z"),
      user_id: "user-123",
    });

    // Simulate getting user details
    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      const users = {
        "user-123": {
          id: "user-123",
          username: "arnold",
          password: "hashedpassword123",
          fullname: "Arnold Smith",
        },
        "user-456": {
          id: "user-456",
          username: "bob",
          password: "hashedpassword456",
          fullname: "Bob Johnson",
        },
        "user-789": {
          id: "user-789",
          username: "charlie",
          password: "hashedpassword789",
          fullname: "Charlie Brown",
        },
      };
      return Promise.resolve(users[userId]);
    });

    // Simulate getting comment details
    mockCommentRepository.getCommentByThreadId = jest.fn().mockResolvedValue([
      {
        id: "comment-123",
        content: "This is a comment",
        created_at: new Date("2023-01-02T00:00:00.000Z"),
        user_id: "user-456",
        thread_id: "thread-123",
        is_delete: false,
      },
    ]);

    // Simulate getting comment reply details
    mockCommentReplyRepository.getCommentReplyByCommentId = jest
      .fn()
      .mockResolvedValue([
        {
          id: "reply-123",
          content: "This is a reply",
          created_at: new Date("2023-01-03T00:00:00.000Z"),
          user_id: "user-789",
          thread_id: "thread-123",
          comment_id: "comment-123",
          is_delete: false,
        },
      ]);

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    // Action
    const threadDetails = await threadUseCase.getDetailsThread("thread-123");

    // Assert: Verify all data entries, including password and fullname
    expect(threadDetails).toStrictEqual(
      new ThreadDetails({
        id: "thread-123",
        title: "Title for thread",
        body: "This is body for thread",
        date: new Date("2023-01-01T00:00:00.000Z").toString(),
        username: "arnold",
        password: "hashedpassword123", // Assert password
        fullname: "Arnold Smith", // Assert fullname
        comments: [
          new CommentDetails({
            id: "comment-123",
            content: "This is a comment",
            date: "Mon Jan 02 2023 07:00:00 GMT+0700 (Western Indonesia Time)",
            username: "bob",
            password: "hashedpassword456", // Assert password
            fullname: "Bob Johnson", // Assert fullname
            is_delete: false,
            replies: [
              new CommentReplyDetails({
                id: "reply-123",
                content: "This is a reply",
                date: "Tue Jan 03 2023 07:00:00 GMT+0700 (Western Indonesia Time)",
                username: "charlie",
                password: "hashedpassword789", // Assert password
                fullname: "Charlie Brown", // Assert fullname
                is_delete: false,
              }),
            ],
          }),
        ],
      })
    );

    // Verifikasi semua pemanggilan fungsi mock
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledTimes(1);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      "thread-123"
    );

    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(
      "thread-123"
    );

    expect(
      mockCommentReplyRepository.getCommentReplyByCommentId
    ).toHaveBeenCalledTimes(1);
    expect(
      mockCommentReplyRepository.getCommentReplyByCommentId
    ).toHaveBeenCalledWith("comment-123");

    expect(mockUserRepository.getUserById).toHaveBeenCalledTimes(3);
    expect(mockUserRepository.getUserById).toHaveBeenNthCalledWith(
      1,
      "user-123"
    );
    expect(mockUserRepository.getUserById).toHaveBeenNthCalledWith(
      2,
      "user-456"
    );
    expect(mockUserRepository.getUserById).toHaveBeenNthCalledWith(
      3,
      "user-789"
    );
  });
});


});
