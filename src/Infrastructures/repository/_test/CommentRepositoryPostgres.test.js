const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const CommentRepositoryPostgress = require("../CommentRepositoryPostgres");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentRepositoryPostgres", () => {
  const userId = "user-123";
  const threadId = "thread-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist added comment", async () => {
      // Arrange
      const newComment = new NewComment({ content: "This is a comment" });
      const fakeIdGenerator = () => "222";
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );
      const comment = await CommentsTableTestHelper.getCommentById(
        "comment-222"
      );

      // Assert mendalam
      expect(comment).toHaveLength(1); // Pastikan ada satu komentar yang ditemukan
      expect(comment[0]).toStrictEqual({
        id: "comment-222",
        content: "This is a comment",
        thread_id: threadId,
        user_id: userId,
        is_delete: false, // Pastikan is_delete disetel ke false untuk komentar baru
        created_at: expect.any(Date), // Pastikan created_at berupa objek Date
      });

      // Validasi tambahan untuk setiap properti
      const savedComment = comment[0];
      expect(savedComment.id).toBe("comment-222");
      expect(savedComment.content).toBe("This is a comment");
      expect(savedComment.thread_id).toBe(threadId);
      expect(savedComment.user_id).toBe(userId);
      expect(savedComment.is_delete).toBe(false);
      expect(savedComment.created_at).toBeInstanceOf(Date);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      const newComment = new NewComment({
        content: "This is a comment",
      });

      const fakeIdGenerator = () => "222";
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );

      // Assert

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-222",
          content: "This is a comment",
          owner: userId,
        })
      );

      expect(addedComment.id).toBe("comment-222");
      expect(addedComment.content).toBe("This is a comment");
      expect(addedComment.owner).toBe(userId);
    });
  });

  describe("verifyCommentAvailability function", () => {
    it("should not throw NotFoundError if comment exists", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        user_id: userId,
        thread_id: threadId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability("comment-123")
      ).resolves.not.toThrowError(NotFoundError);
    });

    it("should throw NotFoundError when comment does not exist", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(
          "nonexistent-comment"
        )
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("getCommentById function", () => {
    it("should return comment correctly", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
        content: "This is a test comment", // menambahkan konten komentar
        is_delete: false, // menambahkan status is_delete
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        "comment-333"
      );

      // Assert
      expect(comment).toHaveProperty("id", "comment-333");
      expect(comment).toHaveProperty("user_id", userId);
      expect(comment).toHaveProperty("thread_id", threadId);
      expect(comment).toHaveProperty("content", "This is a test comment"); // memverifikasi konten
      expect(comment).toHaveProperty("is_delete", false); // memverifikasi status is_delete
      expect(comment.created_at).toBeInstanceOf(Date);

      // Validasi tambahan untuk memastikan bahwa nilai lainnya benar
      expect(comment.id).toBe("comment-333");
      expect(comment.user_id).toBe(userId);
      expect(comment.thread_id).toBe(threadId);
      expect(comment.content).toBe("This is a test comment"); // memverifikasi konten
      expect(comment.is_delete).toBe(false); // memverifikasi status is_delete
    });
  });

  describe("getCommentByThreadId function", () => {
    it("should return comments correctly", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
        content: "This is a comment",
        is_delete: false,
        created_at: new Date(),
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-222",
        user_id: userId,
        thread_id: threadId,
        content: "Another comment",
        is_delete: false,
        created_at: new Date(),
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      // Assert mendalam
      expect(comments).toHaveLength(2); // Pastikan ada 2 komentar yang dikembalikan

      // Validasi setiap komentar
      comments.forEach((comment) => {
        expect(comment).toHaveProperty("id");
        expect(comment).toHaveProperty("content"); // Pastikan content ada
        expect(comment).toHaveProperty("created_at"); // Pastikan created_at ada
        expect(comment).toHaveProperty("user_id");
        expect(comment).toHaveProperty("thread_id");
        expect(comment).toHaveProperty("is_delete", false); // Memastikan nilai default is_delete adalah false
        expect(comment.created_at).toBeInstanceOf(Date); // Pastikan created_at adalah objek Date

        // Validasi setiap komentar individual dengan ID yang sesuai
        if (comment.id === "comment-333") {
          expect(comment.user_id).toBe(userId);
          expect(comment.thread_id).toBe(threadId);
          expect(comment.content).toBe("This is a comment");
        }
        if (comment.id === "comment-222") {
          expect(comment.user_id).toBe(userId);
          expect(comment.thread_id).toBe(threadId);
          expect(comment.content).toBe("Another comment");
        }
      });
    });
  });

  describe("deleteComment function", () => {
    it("should soft delete comment correctly and persist comment", async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
        is_delete: false,
        content: "This is a comment", // Menambahkan content untuk uji coba
        created_at: new Date().toISOString(), // Menambahkan created_at
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgress(
        pool,
        {}
      );

      // Action
      await commentRepositoryPostgres.deleteComment(
        "comment-333",
        threadId,
        userId
      );
      const deletedComment = await CommentsTableTestHelper.getCommentById(
        "comment-333"
      );

      // Assert mendalam
      expect(deletedComment).toHaveLength(1);
      const comment = deletedComment[0];

      // Validasi bahwa komentar memiliki properti yang benar setelah dihapus
      expect(comment.id).toBe("comment-333");
      expect(comment.user_id).toBe(userId);
      expect(comment.thread_id).toBe(threadId);
      expect(comment.is_delete).toBe(true);
      expect(comment.content).toBe("This is a comment"); // Memeriksa content
      expect(comment.created_at).toBeTruthy(); // Memeriksa created_at
    });
  });
});
