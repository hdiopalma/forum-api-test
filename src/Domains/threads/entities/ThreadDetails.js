class ThreadDetails {
   constructor(payload) {
      this._validatePayload(payload);
      const {
         id, title, body, date, username, comments,
      } = payload;
      this.id = id;
      this.title = title;
      this.body = body;
      this.date = date;
      this.username = username;
      this.comments = comments;
   }

   _validatePayload(payload) {
      this._validateRequiredProperties(payload);
      this._validatePropertyTypes(payload);
   }

   _validateRequiredProperties({
      id, title, body, date, username, comments,
   }) {
      if (!id || !title || !body || !date || !username || !comments) {
         throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
      }
   }

   _validatePropertyTypes({
      id, title, body, date, username, comments,
   }) {
      if (
         typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || !Array.isArray(comments)
      ) {
         throw new Error('THREAD_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE');
      }
   }
}

module.exports = ThreadDetails;
