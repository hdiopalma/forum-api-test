const CommentDetails = require("../CommentDetails"); // Pastikan path sesuai dengan lokasi file CommentDetails.js

describe("CommentDetails", () => {
  it("should create CommentDetails instance when given valid payload", () => {
    const payload = {
      id: "comment-1",
      content: "This is a comment",
      date: "2024-11-24",
      username: "user1",
      replies: [],
    };

    const comment = new CommentDetails(payload);

    expect(comment.id).toBe(payload.id);
    expect(comment.content).toBe(payload.content);
    expect(comment.date).toBe(payload.date);
    expect(comment.username).toBe(payload.username);
    expect(comment.replies).toEqual(payload.replies);
  });

  it("should throw error if required properties are missing", () => {
    const payload = {
      id: "comment-1",
      content: "This is a comment",
      date: "2024-11-24",
      username: "user1",
      // replies is missing
    };

    expect(() => new CommentDetails(payload)).toThrowError(
      "COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error if any property has wrong data type", () => {
    const payload = {
      id: 123, // Wrong type (should be string)
      content: "This is a comment",
      date: "2024-11-24",
      username: "user1",
      replies: [],
    };

    expect(() => new CommentDetails(payload)).toThrowError(
      "COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("should mark comment as deleted if is_delete is true", () => {
    const payload = {
      id: "comment-1",
      content: "This is a comment",
      date: "2024-11-24",
      username: "user1",
      replies: [],
      is_delete: true,
    };

    const comment = new CommentDetails(payload);

    expect(comment.content).toBe("**komentar telah dihapus**");
  });

  it("should not change content if is_delete is false", () => {
    const payload = {
      id: "comment-1",
      content: "This is a comment",
      date: "2024-11-24",
      username: "user1",
      replies: [],
      is_delete: false,
    };

    const comment = new CommentDetails(payload);

    expect(comment.content).toBe("This is a comment");
  });
});
