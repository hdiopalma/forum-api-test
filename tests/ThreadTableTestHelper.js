/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const QUERIES = {
  INSERT_THREAD: `
    INSERT INTO threads (id, title, body, created_at, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, user_id
  `,
  SELECT_THREAD_BY_ID: `
    SELECT * FROM threads WHERE id = $1
  `,
  DELETE_ALL_THREADS: `
    DELETE FROM threads
  `,
};

const ThreadTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "Thread helper",
    body = "This is helper thread",
    created_at = new Date(),
    user_id = "user-123",
  }) {
    const values = [id, title, body, created_at, user_id];
    const query = {
      text: QUERIES.INSERT_THREAD,
      values,
    };

    await pool.query(query);
  },

  async findThreadById(threadId) {
    const values = [threadId];
    const query = {
      text: QUERIES.SELECT_THREAD_BY_ID,
      values,
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query(QUERIES.DELETE_ALL_THREADS);
  },
};

module.exports = ThreadTableTestHelper;
