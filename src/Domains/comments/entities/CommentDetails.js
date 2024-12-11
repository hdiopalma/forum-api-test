class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);
    this._extractPayloadData(payload);
    this._markDeletedIfNeeded(payload); // Memanggil fungsi untuk memeriksa dan menandai komentar yang dihapus
  }

  _verifyPayload(payload) {
    this._checkRequiredProperties(payload);
    this._checkPropertyTypes(payload);
  }

  _checkRequiredProperties({ id, content, date, username, replies }) {
    if (!id || !content || !date || !username || !replies) {
      throw new Error("COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY");
    }
  }

  _checkPropertyTypes({ id, content, date, username, replies }) {
    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof username !== "string" ||
      !Array.isArray(replies)
    ) {
      throw new Error("COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE");
    }
  }

  _extractPayloadData({ id, content, date, username, replies }) {
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }

  // Fungsi untuk memeriksa apakah komentar sudah dihapus
  _markDeletedIfNeeded(comment) {
    if (comment.is_delete) {
      this.content = "**komentar telah dihapus**";
    }
  }
}

module.exports = CommentDetails;
