const ClientError = require("../ClientError");

describe("ClientError", () => {
  it("must raise an error when instantiated directly", () => {
    expect(() => new ClientError("")).toThrowError(
      "cannot instantiate abstract class"
    );
  });
});
