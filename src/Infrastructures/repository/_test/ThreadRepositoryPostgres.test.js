const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  const userId = "user-123";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("verifyThreadAvailability function", () => {
    it("should throw NotFoundError when thread does not exist", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability("thread-521")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread exists", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: "thread-521",
        title: "Thread test",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability("thread-521")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("addNewThread function", () => {
    it("should persist added thread", async () => {
      // Arrange
      const newThread = new NewThread({
        title: "First thread",
        body: "This is a new thread",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addNewThread(newThread, userId);

      // Assert mendalam
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");

      // Pastikan hanya ada satu thread dengan ID yang diharapkan
      expect(threads).toHaveLength(1);

      // Ambil thread pertama yang ditemukan
      const thread = threads[0];

      // Validasi properti thread
      expect(thread).toHaveProperty("id", "thread-123"); // Validasi ID thread
      expect(thread).toHaveProperty("title", "First thread"); // Validasi title thread
      expect(thread).toHaveProperty("body", "This is a new thread"); // Validasi body thread
      expect(thread).toHaveProperty("user_id", userId); // Validasi user_id yang sesuai dengan pengguna yang membuat thread
      expect(thread).toHaveProperty("created_at"); // Pastikan created_at ada

      // Validasi apakah created_at dan updated_at adalah objek Date
      expect(thread.created_at).toBeInstanceOf(Date);
    });

    it("should return thread correctly", async () => {
      // Arrange
      const newThread = new NewThread({
        title: "First thread",
        body: "This is a new thread",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addNewThread(
        newThread,
        userId
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "First thread",
          owner: "user-123",
          body: "This is a new thread",
          created_at: expect.any(String)
        })
      );
    });
  });

  describe("getThreadById function", () => {
    it("should get the right thread", async () => {
      // Arrange

      const threadData = {
        id: "thread-521",
        title: "Thread test",
        body: "This is a thread body",
        owner: "user-123",
        created_at: new Date("2023-11-26T10:00:00.000Z"),
      };

      await ThreadsTableTestHelper.addThread(threadData);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById("thread-521");

      // Assert
      expect(thread).toStrictEqual({
        id: "thread-521",
        title: "Thread test",
        body: "This is a thread body",
        user_id: "user-123",
        created_at: threadData.created_at,
      });
    });
  });
});
