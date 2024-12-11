class UserRepository {
  static METHOD_NOT_IMPLEMENTED_ERROR =
    "USER_REPOSITORY.METHOD_NOT_IMPLEMENTED";

  async addUser(registerUser) {
    throw new Error(UserRepository.METHOD_NOT_IMPLEMENTED_ERROR);
  }

  async verifyAvailableUsername(username) {
    throw new Error(UserRepository.METHOD_NOT_IMPLEMENTED_ERROR);
  }
  async verifyUsernameAvailability(username) {
    throw new Error(UserRepository.METHOD_NOT_IMPLEMENTED_ERROR);
  }
  async verifyUserAvailability(userId) {
    throw new Error(UserRepository.METHOD_NOT_IMPLEMENTED_ERROR);
  }

  async getPasswordByUsername(username) {
    throw new Error(UserRepository.METHOD_NOT_IMPLEMENTED_ERROR);
  }

  async getIdByUsername(username) {
    throw new Error(UserRepository.METHOD_NOT_IMPLEMENTED_ERROR);
  }

  async getUserById(userId) {
    throw new Error(UserRepository.METHOD_NOT_IMPLEMENTED_ERROR);
  }
}

module.exports = UserRepository;
