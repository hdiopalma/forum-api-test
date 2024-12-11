// Mendefinisikan pesan kesalahan sebagai konstanta
const ERROR_MESSAGE = {
   METHOD_NOT_IMPLEMENTED: 'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED',
};

class AuthenticationRepository {
   async addToken(token) {
      throw new Error(ERROR_MESSAGE.METHOD_NOT_IMPLEMENTED);
   }

   async checkAvailabilityToken(token) {
      throw new Error(ERROR_MESSAGE.METHOD_NOT_IMPLEMENTED);
   }

   async deleteToken(token) {
      throw new Error(ERROR_MESSAGE.METHOD_NOT_IMPLEMENTED);
   }
}

module.exports = AuthenticationRepository;
