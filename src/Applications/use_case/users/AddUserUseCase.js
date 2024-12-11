const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
   constructor({ userRepository, passwordHash }) {
      this._userRepository = userRepository;
      this._passwordHash = passwordHash;
   }

   async execute(useCasePayload) {
      const registerUser = new RegisterUser(useCasePayload);

      await this._checkUsernameAvailability(registerUser.username);
      registerUser.password = await this._hashPassword(registerUser.password);

      return this._addUser(registerUser);
   }

   async _checkUsernameAvailability(username) {
      await this._userRepository.verifyAvailableUsername(username);
   }

   async _hashPassword(password) {
      return this._passwordHash.hash(password);
   }

   async _addUser(registerUser) {
      return this._userRepository.addUser(registerUser);
   }
}

module.exports = AddUserUseCase;
