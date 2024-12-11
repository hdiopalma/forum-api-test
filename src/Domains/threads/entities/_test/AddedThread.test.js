/* eslint-disable no-undef */

const AddedThread = require("../AddedThread");

describe("AddedThread entity", () => {
  let payload;

  beforeEach(() => {
    payload = {
      id: "thread-123",
      title: "This is title",
    };
  });

  it("throws an error when payload is missing required properties", () => {
    // Arrange
    const incompletePayload = { ...payload };

    // Action and Assert
    expect(() => new AddedThread(incompletePayload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws an error when payload properties do not match required data types", () => {
    // Arrange
    const invalidPayload = { ...payload, owner: 123 };

    // Action and Assert
    expect(() => new AddedThread(invalidPayload)).toThrowError(
      "ADDED_THREAD.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED"
    );
  });

  it("creates an AddedThread object successfully when payload is valid", () => {
    // Arrange
    const validPayload = { ...payload, owner: "user-123" };

    // Action
    const addedThread = new AddedThread(validPayload);

    // Assert
    expect(addedThread.id).toEqual(validPayload.id);
    expect(addedThread.title).toEqual(validPayload.title);
    expect(addedThread.owner).toEqual(validPayload.owner);
  });
});
