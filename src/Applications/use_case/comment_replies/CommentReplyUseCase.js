const NewCommentReply = require("../../../Domains/comment_replies/entities/NewCommentReply");

class CommentReplyUseCase {
  constructor({
    commentReplyRepository,
    commentRepository,
    threadRepository,
    userRepository,
    ownerValidator,
  }) {
    this._commentReplyRepository = commentReplyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._ownerValidator = ownerValidator;
  }

  // Fungsi untuk menambahkan balasan komentar
  async addCommentReply(
    useCasePayload,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    const { content } = new NewCommentReply(useCasePayload);

    // Verifikasi ketersediaan komentar
    await this._commentRepository.verifyCommentAvailability(useCaseCommentId);

    // Verifikasi ketersediaan thread
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);

    // Verifikasi ketersediaan user
    await this._userRepository.verifyUserAvailability(useCaseCredential);

    // Menambahkan balasan komentar
    return this._commentReplyRepository.addCommentReply(
      content,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );
  }

  // Fungsi untuk menghapus balasan komentar
  async deleteCommentReply(
    useCaseCommentReplyId,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    await this._commentReplyRepository.verifyCommentReplyAvailability(
      useCaseCommentReplyId
    );
    const commentReply = await this._commentReplyRepository.getCommentReplyById(
      useCaseCommentReplyId
    );

    await this._ownerValidator.verifyOwner(
      useCaseCredential,
      commentReply.user_id,
      "comment reply"
    );

    return this._commentReplyRepository.deleteCommentReply(
      commentReply.id,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );
  }
}

module.exports = CommentReplyUseCase;
