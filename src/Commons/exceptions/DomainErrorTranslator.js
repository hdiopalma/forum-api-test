const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return this._directories[error.message] || error;
  },

  _directories: {
    "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "tidak dapat menambah user baru karena properti yang diperlukan tidak lengkap"
    ),
    "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "tidak dapat menambah user baru kata tipe data tidak cocok"
    ),
    "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
      "cannot create a new user because the username exceeds the character limit"
    ),
    "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
      "tidak dapat membuat user baru karena username mengandung karakter terlarang"
    ),
    "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "must provide both username and password"
    ),
    "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
      "username and password must be strings"
    ),
    "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
      new InvariantError("must provide a refresh token"),
    "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
      new InvariantError("refresh token must be a string"),
    "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
      new InvariantError("must provide a refresh token"),
    "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
      new InvariantError("refresh token must be a string"),
    "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "tidak dapat membuat thread baru karena payload tidak tepat"
    ),
    "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
      "Tidak dapat membuat thread baru, properti payload memiliki tipe data yang salah."
    ),
    "NEW_THREAD.TITLE_EXCEED_LIMIT": new InvariantError(
      "title exceeds 50 characters"
    ),
    "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "tidak dapat membuat komentar baru karena payload salah"
    ),
    "NEW_COMMENT.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
      "Tidak dapat membuat komentar baru, properti payload memiliki tipe data yang salah"
    ),
    "NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "gagal menambahkan balasan, payload salah"
    ),
    "NEW_COMMENT_REPLY.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
      "balasan gagal ditambahkan, data yang dimasukkan salah"
    ),
    "THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "cannot create new thread details, payload not correct"
    ),
    "THREAD_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
      "cannot create new thread details, payload property has wrong data type"
    ),
    "COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "cannot create new comment details, payload not correct"
    ),
    "COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
      "cannot create new comment details, payload property has wrong data type"
    ),
    "COMMENT_REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
      "cannot create new comment reply details, payload not correct"
    ),
    "COMMENT_REPLY_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE": new InvariantError(
      "cannot create new comment reply details, payload property has wrong data type"
    ),
  },
};

module.exports = DomainErrorTranslator;
