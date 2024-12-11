const NewComment = require("../NewComment");

describe("NewComment entity", () => {
  const createNewCommentWithPayload = (payload) => () =>
    new NewComment(payload);

  it("should throw an error when payload is missing required properties", () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(createNewCommentWithPayload(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw an error when payload contains incorrect data types", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(createNewCommentWithPayload(payload)).toThrowError(
      "NEW_COMMENT.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("should throw an error when payload contains empty strings", () => {
    // Arrange
    const payload = {
      content: "    ",
    };

    // Action & Assert
    expect(createNewCommentWithPayload(payload)).toThrowError(
      "NEW_COMMENT.CANNOT_BE_EMPTY_STRING"
    );
  });

  it("should create a newComment object correctly", () => {
    // Arrange
    const payload = {
      content: "this is content",
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual(payload.content);
  });
});
