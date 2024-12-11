const ThreadDetails = require("../ThreadDetails");

describe("ThreadDetails", () => {
  describe("when instantiating ThreadDetails", () => {
    it("should create ThreadDetails object correctly", () => {
      // Arrange
      const payload = {
        id: "thread-123",
        title: "Thread Title",
        body: "This is a thread body",
        date: "2024-11-26T10:00:00.000Z",
        username: "user-abc",
        comments: [
          { id: "comment-1", content: "This is a comment" },
          { id: "comment-2", content: "This is another comment" },
        ],
      };

      // Action
      const threadDetails = new ThreadDetails(payload);

      // Assert
      expect(threadDetails.id).toBe(payload.id);
      expect(threadDetails.title).toBe(payload.title);
      expect(threadDetails.body).toBe(payload.body);
      expect(threadDetails.date).toBe(payload.date);
      expect(threadDetails.username).toBe(payload.username);
      expect(threadDetails.comments).toEqual(payload.comments);
    });

    it("should throw error when missing required properties", () => {
      // Arrange
      const payload = {
        id: "thread-123",
        title: "Thread Title",
        body: "This is a thread body",
        date: "2024-11-26T10:00:00.000Z",
        username: "user-abc",
        // comments is missing
      };

      // Action and Assert
      expect(() => new ThreadDetails(payload)).toThrowError(
        "THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });

    it("should throw error when properties have incorrect data types", () => {
      // Arrange
      const payload = {
        id: "thread-123",
        title: "Thread Title",
        body: "This is a thread body",
        date: "2024-11-26T10:00:00.000Z",
        username: "user-abc",
        comments: "This is not an array", // Incorrect data type
      };

      // Action and Assert
      expect(() => new ThreadDetails(payload)).toThrowError(
        "THREAD_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE"
      );
    });
  });
});
