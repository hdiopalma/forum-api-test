const pool = require("../src/Infrastructures/database/postgres/pool");

const QUERIES = {
  INSERT_TOKEN: "INSERT INTO authentications (token) VALUES($1)",
  SELECT_TOKEN: "SELECT token FROM authentications WHERE token = $1",
  DELETE_ALL_TOKENS: "DELETE FROM authentications",
};

class AuthenticationsTableTestHelper {
  constructor(pool) {
    this._pool = pool;
  }

  async addToken(token) {
    const query = {
      text: QUERIES.INSERT_TOKEN,
      values: [token],
    };

    await this._pool.query(query);
  }

  async findToken(token) {
    const query = {
      text: QUERIES.SELECT_TOKEN,
      values: [token],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async cleanTable() {
    const query = {
      text: QUERIES.DELETE_ALL_TOKENS,
    };

    await this._pool.query(query);
  }
}

module.exports = new AuthenticationsTableTestHelper(pool);
