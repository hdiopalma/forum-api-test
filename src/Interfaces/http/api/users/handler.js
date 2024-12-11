const AddUserUseCase = require('../../../../Applications/use_case/users/AddUserUseCase');

class UsersHandler {
   constructor(container) {
      this._container = container;
      this.postUserHandler = this._postUserHandler.bind(this);
   }

   async _postUserHandler(request, h) {
      const addUserUseCase = this._createAddUserUseCase();
      const addedUser = await addUserUseCase.execute(request.payload);
      return this._createResponse(addedUser, h);
   }

   _createAddUserUseCase() {
      return this._container.getInstance(AddUserUseCase.name);
   }

   _createResponse(addedUser, h) {
      const response = h.response({
         status: 'success',
         data: { addedUser },
      });
      response.code(201);
      return response;
   }
}

module.exports = UsersHandler;
