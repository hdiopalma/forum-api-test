const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository", () => {
  let threadRepository;

  beforeEach(() => {
    threadRepository = new ThreadRepository();
  });

  describe("verifyThreadAvailability", () => {
    it("should throw error when verifyThreadAvailability is called", async () => {
      await expect(
        threadRepository.verifyThreadAvailability("thread-123")
      ).rejects.toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("addNewThread", () => {
    it("should throw error when addNewThread is called", async () => {
      const thread = { title: "New Thread", body: "This is the thread body." };
      const ownerId = "user-123";

      await expect(
        threadRepository.addNewThread(thread, ownerId)
      ).rejects.toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });

  describe("getThreadById", () => {
    it("should throw error when getThreadById is called", async () => {
      await expect(
        threadRepository.getThreadById("thread-123")
      ).rejects.toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    });
  });
});
