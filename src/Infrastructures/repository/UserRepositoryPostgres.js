const InvariantError = require("../../Commons/exceptions/InvariantError");
const RegisteredUser = require("../../Domains/users/entities/RegisteredUser");
const UserRepository = require("../../Domains/users/UserRepository");

const USER_NOT_FOUND = "user not found";
const USERNAME_NOT_FOUND = "username tidak ditemukan";
const USERNAME_NOT_AVAILABLE = "username tidak tersedia";

const QUERY_TEXTS = {
  SELECT_USERNAME: "SELECT username FROM users WHERE username = $1",
  INSERT_USER:
    "INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id, username, fullname",
  SELECT_PASSWORD_BY_USERNAME: "SELECT password FROM users WHERE username = $1",
  SELECT_ID_BY_USERNAME: "SELECT id FROM users WHERE username = $1",
  SELECT_USER_BY_ID: "SELECT * FROM users WHERE id = $1",
  SELECT_ID_BY_USER: "SELECT id FROM users WHERE id = $1",
};

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  // Fungsi untuk memverifikasi ketersediaan username
  async verifyAvailableUsername(username) {
    const query = {
      text: QUERY_TEXTS.SELECT_USERNAME,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(USERNAME_NOT_AVAILABLE);
    }
  }

  // Fungsi untuk memverifikasi keberadaan username
  async verifyUsernameAvailability(username) {
    const query = {
      text: QUERY_TEXTS.SELECT_USERNAME,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError(USERNAME_NOT_FOUND);
    }

    return true;
  }

  // Fungsi untuk memverifikasi keberadaan user berdasarkan ID
  async verifyUserAvailability(userId) {
    const query = {
      text: QUERY_TEXTS.SELECT_ID_BY_USER,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError(USER_NOT_FOUND);
    }

    return true;
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: QUERY_TEXTS.INSERT_USER,
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser(result.rows[0]);
  }

  async getPasswordByUsername(username) {
    const query = {
      text: QUERY_TEXTS.SELECT_PASSWORD_BY_USERNAME,
      values: [username],
    };

    const result = await this._pool.query(query);
    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: QUERY_TEXTS.SELECT_ID_BY_USERNAME,
      values: [username],
    };

    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
      text: QUERY_TEXTS.SELECT_USER_BY_ID,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = UserRepositoryPostgres;
