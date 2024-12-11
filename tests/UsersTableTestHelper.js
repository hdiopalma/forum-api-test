/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

// Define query text as constants
const QUERY_TEXT = {
  INSERT_USER:
    "INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4)",
  SELECT_USER_BY_ID: "SELECT * FROM users WHERE id = $1",
  DELETE_ALL_USERS: "DELETE FROM users",
};

const UsersTableTestHelper = {
  async addUser({
    id = "user-123",
    username = "dicoding",
    password = "secret",
    fullname = "Dicoding Indonesia",
  }) {
    await this._executeQuery(QUERY_TEXT.INSERT_USER, [
      id,
      username,
      password,
      fullname,
    ]);
  },

  async findUsersById(id) {
    const result = await this._executeQuery(QUERY_TEXT.SELECT_USER_BY_ID, [id]);
    return result.rows;
  },

  async cleanTable() {
    await this._executeQuery(QUERY_TEXT.DELETE_ALL_USERS);
  },

  // Helper function to execute queries
  async _executeQuery(text, values = []) {
    const query = { text, values };
    return await pool.query(query);
  },
};

module.exports = UsersTableTestHelper;
