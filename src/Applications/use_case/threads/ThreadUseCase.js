const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadDetails = require("../../../Domains/threads/entities/ThreadDetails");
const CommentDetails = require("../../../Domains/comments/entities/CommentDetails");
const CommentReplyDetails = require("../../../Domains/comment_replies/entities/CommentReplyDetails");

class ThreadUseCase {
  constructor({
    threadRepository,
    userRepository,
    commentRepository,
    commentReplyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async addThread(useCasePayload, useCaseCredential) {
    const newThread = this._createNewThread(useCasePayload);
    return this._threadRepository.addNewThread(newThread, useCaseCredential);
  }

  async getDetailsThread(useCaseThreadId) {
    const threadFromDb = await this._threadRepository.getThreadById(
      useCaseThreadId
    );
    const thread = await this._createThreadDetails(threadFromDb);
    const commentsInThread = await this._getCommentsByThreadId(thread.id);
    for (const commentData of commentsInThread) {
      const commentDetails = await this._createCommentDetails(commentData);
      thread.comments.push(commentDetails);
    }

    return thread;
  }

  _createNewThread(payload) {
    return new NewThread(payload);
  }

  async _getCommentsByThreadId(threadId) {
    return this._commentRepository.getCommentByThreadId(threadId);
  }

  async _createThreadDetails(threadFromDb) {
    const { username: threadUsername } = await this._userRepository.getUserById(
      threadFromDb.user_id
    );
    return new ThreadDetails({
      id: threadFromDb.id,
      title: threadFromDb.title,
      body: threadFromDb.body,
      date: threadFromDb.created_at.toString(),
      username: threadUsername,
      comments: [],
    });
  }

  async _createCommentDetails(commentData) {
    const { username: commentUsername } =
      await this._userRepository.getUserById(commentData.user_id);

    // Instansiasi CommentDetails tanpa perlu memeriksa is_delete di sini
    const commentDetails = new CommentDetails({
      id: commentData.id,
      content: commentData.content,
      date: commentData.created_at.toString(),
      username: commentUsername,
      replies: [],
      is_delete: commentData.is_delete, // is_delete tetap diteruskan
    });

    const repliesInComment = await this._getRepliesByCommentId(commentData.id);
    for (const replyData of repliesInComment) {
      const commentReplyDetails = await this._createCommentReplyDetails(
        replyData
      );
      commentDetails.replies.push(commentReplyDetails);
    }

    return commentDetails;
  }

  async _getRepliesByCommentId(commentId) {
    return this._commentReplyRepository.getCommentReplyByCommentId(commentId);
  }

  async _createCommentReplyDetails(replyData) {
    const { username: replyUsername } = await this._userRepository.getUserById(
      replyData.user_id
    );

    // Instansiasi CommentReplyDetails yang sekarang sudah menangani logika is_delete
    return new CommentReplyDetails({
      id: replyData.id,
      content: replyData.content,
      date: replyData.created_at.toString(),
      username: replyUsername,
      is_delete: replyData.is_delete, // is_delete tetap diteruskan
    });
  }
}

module.exports = ThreadUseCase;
