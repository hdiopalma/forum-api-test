const ThreadUseCase = require("../../../../Applications/use_case/threads/ThreadUseCase");

class ThreadHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await threadUseCase.addThread(request.payload, userId);
    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailsHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const { threadId } = request.params;

    // Mendapatkan detail thread, verifikasi ketersediaan thread dilakukan di dalam metode getThreadById
    const thread = await threadUseCase.getDetailsThread(threadId);
    const response = h.response({
      status: "success",
      data: { thread },
    });

    return response;
  }
}

module.exports = ThreadHandler;
