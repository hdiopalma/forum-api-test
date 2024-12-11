const NewComment = require("../../../Domains/comments/entities/NewComment");

class CommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
    userRepository,
    ownerValidator,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._ownerValidator = ownerValidator;
  }

  // Method untuk menambahkan komentar
  async addComment(useCasePayload, useCaseThreadId, useCaseCredential) {
    const { content } = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);
    await this._userRepository.verifyUserAvailability(useCaseCredential);

    return this._commentRepository.addComment(
      content,
      useCaseThreadId,
      useCaseCredential
    );
  }

  // Method untuk menghapus komentar
  async deleteComment(useCaseCommentId, useCaseThreadId, useCaseCredential) {
    await this._commentRepository.verifyCommentAvailability(useCaseCommentId);

    const comment = await this._commentRepository.getCommentById(
      useCaseCommentId
    );

    // Verifikasi pemilik komentar
    await this._ownerValidator.verifyOwner(
      comment.user_id,
      useCaseCredential,
      "comment"
    );

    // Hapus komentar
    return this._commentRepository.deleteComment(
      useCaseCommentId,
      useCaseThreadId,
      useCaseCredential
    );
  }
}

module.exports = CommentUseCase;
