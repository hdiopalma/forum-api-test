const DomainErrorTranslator = require("../DomainErrorTranslator");
const InvariantError = require("../InvariantError");

describe("DomainErrorTranslator", () => {
  it("should translate error messages correctly", () => {
    // Daftar pesan error yang harus diterjemahkan beserta pesan hasil terjemahannya
    const testCases = [
      {
        input: { message: "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY" },
        expected:
          "tidak dapat menambah user baru karena properti yang diperlukan tidak lengkap",
      },
      {
        input: { message: "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION" },
        expected: "tidak dapat menambah user baru kata tipe data tidak cocok",
      },
      {
        input: { message: "REGISTER_USER.USERNAME_LIMIT_CHAR" },
        expected:
          "cannot create a new user because the username exceeds the character limit",
      },
      {
        input: {
          message: "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER",
        },
        expected:
          "tidak dapat membuat user baru karena username mengandung karakter terlarang",
      },
      {
        input: { message: "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY" },
        expected: "must provide both username and password",
      },
      {
        input: { message: "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION" },
        expected: "username and password must be strings",
      },
      {
        input: { message: "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY" },
        expected: "tidak dapat membuat thread baru karena payload tidak tepat",
      },
      {
        input: { message: "NEW_THREAD.TITLE_EXCEED_LIMIT" },
        expected: "title exceeds 50 characters",
      },
      {
        input: { message: "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY" },
        expected: "tidak dapat membuat komentar baru karena payload salah",
      },
      {
        input: { message: "NEW_COMMENT.PROPERTY_HAVE_WRONG_DATA_TYPE" },
        expected:
          "Tidak dapat membuat komentar baru, properti payload memiliki tipe data yang salah",
      },
      {
        input: {
          message: "COMMENT_REPLY_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE",
        },
        expected:
          "cannot create new comment reply details, payload property has wrong data type",
      },
      // Tambahkan kasus lain sesuai dengan direktori yang ada di _directories
    ];

    testCases.forEach(({ input, expected }) => {
      const translatedError = DomainErrorTranslator.translate(input);
      expect(translatedError).toBeInstanceOf(InvariantError);
      expect(translatedError.message).toStrictEqual(expected);
    });
  });

  it("should return original error if message is not recognized", () => {
    const error = new Error("UNKNOWN_ERROR");
    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toStrictEqual(error);
  });
});
