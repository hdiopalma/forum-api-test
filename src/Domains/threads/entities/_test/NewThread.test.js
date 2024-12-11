const NewThread = require("../NewThread");

describe("NewThread", () => {
  describe("constructor", () => {
    it("should create NewThread instance correctly when payload is valid", () => {
      // Arrange
      const payload = {
        title: "Valid Thread Title",
        body: "This is the body of the thread.",
      };

      // Action
      const newThread = new NewThread(payload);

      // Assert
      expect(newThread).toBeInstanceOf(NewThread);
      expect(newThread.title).toEqual(payload.title);
      expect(newThread.body).toEqual(payload.body);
    });

    it("should throw error when payload does not contain needed properties", () => {
      // Arrange
      const payload = {
        title: "Valid Thread Title",
      };

      // Action & Assert
      expect(() => new NewThread(payload)).toThrowError(
        "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });

    it("should throw error when title or body is not a string", () => {
      // Arrange
      const payloads = [
        { title: 123, body: "This is the body." },
        { title: "Valid Title", body: 456 },
        { title: [], body: "This is the body." },
        { title: "Valid Title", body: {} },
      ];

      // Action & Assert
      payloads.forEach((payload) => {
        expect(() => new NewThread(payload)).toThrowError(
          "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE"
        );
      });
    });

    it("should throw error when title exceeds character limit", () => {
      // Arrange
      const payload = {
        title: "A".repeat(51), // 51 characters long
        body: "This is the body of the thread.",
      };

      // Action & Assert
      expect(() => new NewThread(payload)).toThrowError(
        "NEW_THREAD.TITLE_EXCEED_CHAR_LIMIT"
      );
    });
  });
});
