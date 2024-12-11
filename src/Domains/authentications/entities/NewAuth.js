class NewAuth {
   constructor({ accessToken, refreshToken }) {
      this._validateTokens(accessToken, refreshToken);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
   }

   _validateTokens(accessToken, refreshToken) {
      this._validatePresence(accessToken, refreshToken);
      this._validateDataType(accessToken, refreshToken);
   }

   _validatePresence(accessToken, refreshToken) {
      if (!accessToken || !refreshToken) {
         throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
      }
   }

   _validateDataType(accessToken, refreshToken) {
      if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
         throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
   }
}

module.exports = NewAuth;
