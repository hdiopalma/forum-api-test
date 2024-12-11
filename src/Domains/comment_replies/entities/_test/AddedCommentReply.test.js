const AddedCommentReply = require("../AddedCommentReply");

const createPayloadWithMissingProperties = () => ({
  id: "thread-123",
  title: "This is title",
  user: "budi",
});

const createPayloadWithInvalidTypes = () => ({
  id: "thread-123",
  content: "This is content",
  owner: 123,
});


const createValidPayload = () => ({
  id: "comment-123",
  content: "This is content",
  owner: "user-123",
});

describe("AddedCommentReply entities", () => {
  it("throws an error when payload is missing required properties", () => {
    // Arrange
    const payload = createPayloadWithMissingProperties();

    // Act and Assert
    expect(() => new AddedCommentReply(payload)).toThrowError(
      "ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws an error when payload properties do not match required data types", () => {
    // Arrange
    const payload = createPayloadWithInvalidTypes();

    // Act and Assert
    expect(() => new AddedCommentReply(payload)).toThrowError(
      "ADDED_COMMENT_REPLY.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED"
    );
  });

  it("creates an AddedCommentReply object correctly", () => {
    // Arrange
    const payload = createValidPayload();

    // Act
    const addedCommentReply = new AddedCommentReply(payload);

    // Assert
    expect(addedCommentReply.id).toEqual(payload.id);
    expect(addedCommentReply.content).toEqual(payload.content);
    expect(addedCommentReply.owner).toEqual(payload.owner);
  });
});
