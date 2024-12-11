const CommentReplyDetails = require("../CommentReplyDetails"); // Pastikan path sesuai dengan lokasi file CommentReplyDetails.js

describe("CommentReplyDetails", () => {
  it("should create CommentReplyDetails instance when given valid payload", () => {
    const payload = {
      id: "reply-1",
      content: "This is a reply",
      date: "2024-11-24",
      username: "user1",
      is_delete: false,
    };

    const reply = new CommentReplyDetails(payload);

    expect(reply.id).toBe(payload.id);
    expect(reply.content).toBe(payload.content);
    expect(reply.date).toBe(payload.date);
    expect(reply.username).toBe(payload.username);
  });

  it("should throw error if required properties are missing", () => {
    const payload = {
      id: "reply-1",
      content: "This is a reply",
      date: "2024-11-24",
      // username is missing
      is_delete: false,
    };

    expect(() => new CommentReplyDetails(payload)).toThrowError(
      "COMMENT_REPLY_DETAILS.MISSING_REQUIRED_PROPERTIES"
    );
  });

  it("should throw error if any property has wrong data type", () => {
    const payload = {
      id: 123, // Wrong type (should be string)
      content: "This is a reply",
      date: "2024-11-24",
      username: "user1",
      is_delete: false,
    };

    expect(() => new CommentReplyDetails(payload)).toThrowError(
      "COMMENT_REPLY_DETAILS.INVALID_PROPERTY_TYPE"
    );
  });

  it("should mark reply as deleted if is_delete is true", () => {
    const payload = {
      id: "reply-1",
      content: "This is a reply",
      date: "2024-11-24",
      username: "user1",
      is_delete: true,
    };

    const reply = new CommentReplyDetails(payload);

    expect(reply.content).toBe("**balasan telah dihapus**");
  });

  it("should not change content if is_delete is false", () => {
    const payload = {
      id: "reply-1",
      content: "This is a reply",
      date: "2024-11-24",
      username: "user1",
      is_delete: false,
    };

    const reply = new CommentReplyDetails(payload);

    expect(reply.content).toBe("This is a reply");
  });
});
