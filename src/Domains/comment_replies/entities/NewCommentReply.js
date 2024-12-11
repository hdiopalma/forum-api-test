class NewCommentReply {
   constructor(payload) {
      this._verifyPayload(payload);
      this.content = payload.content;
   }

   _verifyPayload(payload) {
      const { content } = payload;

      if (!content) {
         throw new Error('NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof content !== 'string') {
         throw new Error('NEW_COMMENT_REPLY.PROPERTY_HAVE_WRONG_DATA_TYPE');
      }

      if (content.trim().length === 0) {
         throw new Error('NEW_COMMENT_REPLY.CANNOT_BE_EMPTY_STRING');
      }
   }
}

module.exports = NewCommentReply;
