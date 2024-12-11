class PasswordHash {
   async hash(password) {
      this._notImplemented();
   }

   async comparePassword(plain, encrypted) {
      this._notImplemented();
   }

   _notImplemented() {
      throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
   }
}

module.exports = PasswordHash;
