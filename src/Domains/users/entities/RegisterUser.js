class RegisterUser {
   constructor(payload) {
      this._verifyPayload(payload);

      const { username, password, fullname } = payload;

      this.username = username;
      this.password = password;
      this.fullname = fullname;
   }

   _verifyPayload(payload) {
      const { username, password, fullname } = payload;

      this._verifyRequiredProperties(username, password, fullname);
      this._verifyDataTypes(username, password, fullname);
      this._verifyUsername(username);
   }

   _verifyRequiredProperties(username, password, fullname) {
      if (!username || !password || !fullname) {
         throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
      }
   }

   _verifyDataTypes(username, password, fullname) {
      if (
         typeof username !== 'string'
      || typeof password !== 'string'
      || typeof fullname !== 'string'
      ) {
         throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
   }

   _verifyUsername(username) {
      if (username.length > 50) {
         throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
      }

      if (!username.match(/^[\w]+$/)) {
         throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
      }
   }
}

module.exports = RegisterUser;
