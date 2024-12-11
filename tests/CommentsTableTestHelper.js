/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

// Define SQL queries
const QUERIES = {
  INSERT_COMMENT: `
    INSERT INTO comments (id, content, created_at, user_id, thread_id, is_delete)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, content, user_id
  `,
  SELECT_COMMENT_BY_ID: "SELECT * FROM comments WHERE id = $1",
  DELETE_ALL_COMMENTS: "DELETE FROM comments",
};

// Helper class for CommentsTable operations
class CommentsTableTestHelper {
  async addComment({
    id = "comment-123",
    content = "This is comment",
    created_at = new Date(),
    user_id = "user-123",
    thread_id = "thread-123",
    is_delete = false,
  }) {
    const query = {
      text: QUERIES.INSERT_COMMENT,
      values: [id, content, created_at, user_id, thread_id, is_delete],
    };

    await pool.query(query);
  }

  async getCommentById(commentId) {
    const query = {
      text: QUERIES.SELECT_COMMENT_BY_ID,
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async cleanTable() {
    const query = {
      text: QUERIES.DELETE_ALL_COMMENTS,
    };

    await pool.query(query);
  }
}

module.exports = new CommentsTableTestHelper();
