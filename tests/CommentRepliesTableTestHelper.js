/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

// SQL queries as constants
const QUERIES = {
  INSERT_COMMENT_REPLY: {
    text: "INSERT INTO comment_replies (id, content, created_at, user_id, thread_id, comment_id, is_delete) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, user_id",
  },
  SELECT_COMMENT_REPLY_BY_ID: {
    text: "SELECT * FROM comment_replies WHERE id = $1",
  },
  DELETE_ALL_COMMENT_REPLIES: "DELETE FROM comment_replies",
};

class CommentRepliesTableTestHelper {
  static async addCommentReply({
    id = "reply-123",
    content = "This is reply",
    created_at = new Date(),
    user_id = "user-123",
    thread_id = "thread-123",
    comment_id = "comment-123",
    is_delete = false,
  }) {
    const query = {
      ...QUERIES.INSERT_COMMENT_REPLY,
      values: [
        id,
        content,
        created_at,
        user_id,
        thread_id,
        comment_id,
        is_delete,
      ],
    };

    await pool.query(query);
  }

  static async getCommentReplyById(id) {
    const query = {
      ...QUERIES.SELECT_COMMENT_REPLY_BY_ID,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  static async cleanTable() {
    await pool.query(QUERIES.DELETE_ALL_COMMENT_REPLIES);
  }
}

module.exports = CommentRepliesTableTestHelper;
