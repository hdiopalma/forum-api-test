const CommentReplyUseCase = require("../../../../Applications/use_case/comment_replies/CommentReplyUseCase");

class CommentReplyHandler {
  constructor(container) {
    this._container = container;
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler(request, h) {
    const commentReplyUseCase = this._container.getInstance(
      CommentReplyUseCase.name
    );
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addedCommentReply = await commentReplyUseCase.addCommentReply(
      request.payload,
      threadId,
      commentId,
      ownerId
    );

    return h
      .response({
        status: "success",
        data: {
          addedReply: addedCommentReply,
        },
      })
      .code(201);
  }

  async deleteCommentReplyHandler(request, h) {
    const commentReplyUseCase = this._container.getInstance(
      CommentReplyUseCase.name
    );
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId, commentReplyId } = request.params;

    await commentReplyUseCase.deleteCommentReply(
      commentReplyId,
      threadId,
      commentId,
      credentialId
    );

    return {
      status: "success",
    };
  }
}

module.exports = CommentReplyHandler;
