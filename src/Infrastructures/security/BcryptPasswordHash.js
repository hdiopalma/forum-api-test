const EncryptionHelper = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends EncryptionHelper {
   constructor(bcrypt, options = { saltRound: 10 }) {
      super();
      const { saltRound } = options;
      this.bcrypt = bcrypt;
      this.saltRound = saltRound;
   }

   hash(password) {
      return this.bcrypt.hash(password, this.saltRound);
   }

   comparePassword(password, hashedPassword) {
      return this.bcrypt.compare(password, hashedPassword).then((result) => {
         if (!result) {
            throw new AuthenticationError(
              "Otentikasi yang diberikan tidak benar"
            );
         }
      });
   }
}

module.exports = BcryptPasswordHash;
