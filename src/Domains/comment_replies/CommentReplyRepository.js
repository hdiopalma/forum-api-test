class CommentReplyRepository {
  async addCommentReply(commentReplyContent, threadId, commentId, ownerId) {
    throw new Error(ErrorMessages.METHOD_NOT_IMPLEMENTED);
  }

  async verifyCommentReplyAvailability(commentReplyId) {
    throw new Error(ErrorMessages.METHOD_NOT_IMPLEMENTED);
  }

  async getCommentReplyById(commentReplyId) {
    throw new Error(ErrorMessages.METHOD_NOT_IMPLEMENTED);
  }

  async getCommentReplyByCommentId(commentId) {
    throw new Error(ErrorMessages.METHOD_NOT_IMPLEMENTED);
  }

  async deleteCommentReply(commentReplyId, threadId, commentId, ownerId) {
    throw new Error(ErrorMessages.METHOD_NOT_IMPLEMENTED);
  }
}

const ErrorMessages = {
   METHOD_NOT_IMPLEMENTED: 'COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
};

module.exports = CommentReplyRepository;
