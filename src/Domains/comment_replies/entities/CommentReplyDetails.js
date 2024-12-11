class CommentReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, is_delete } = payload;
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;

    // Menangani logika "balasan telah dihapus"
    this._checkAndMarkAsDeleted(is_delete);
  }

  _verifyPayload(payload) {
    const { id, content, date, username } = payload;
    this._ensurePropertiesArePresent(id, content, date, username);
    this._ensurePropertiesHaveCorrectTypes(id, content, date, username);
  }

  _ensurePropertiesArePresent(id, content, date, username) {
    if (!id || !content || !date || !username) {
      throw new Error("COMMENT_REPLY_DETAILS.MISSING_REQUIRED_PROPERTIES");
    }
  }

  _ensurePropertiesHaveCorrectTypes(id, content, date, username) {
    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string"
    ) {
      throw new Error("COMMENT_REPLY_DETAILS.INVALID_PROPERTY_TYPE");
    }
  }

  _checkAndMarkAsDeleted(is_delete) {
    // Jika balasan sudah dihapus, ubah konten menjadi "**balasan telah dihapus**"
    if (is_delete) {
      this.content = "**balasan telah dihapus**";
    }
  }
}

module.exports = CommentReplyDetails;
