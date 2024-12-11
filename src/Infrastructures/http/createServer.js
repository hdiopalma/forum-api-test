require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const ClientError = require("../../Commons/exceptions/ClientError");
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");
const users = require("../../Interfaces/http/api/users");
const authentications = require("../../Interfaces/http/api/authentications");
const threads = require("../../Interfaces/http/api/threads");
const comments = require("../../Interfaces/http/api/comments");
const comment_replies = require("../../Interfaces/http/api/comment_replies");

const SERVER_ERROR_MESSAGE = "terjadi kegagalan pada server kami";
const STATUS_FAIL = "fail";
const STATUS_ERROR = "error";

const registerPlugins = async (server, container) => {
  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: comment_replies,
      options: { container },
    },
  ]);
};

const configureAuthStrategy = (server) => {
  server.auth.strategy("forum_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
};

const handleErrors = (request, h) => {
  const { response } = request;

  if (response instanceof Error) {
    const translatedError = DomainErrorTranslator.translate(response);

    if (translatedError instanceof ClientError) {
      const newResponse = h.response({
        status: STATUS_FAIL,
        message: translatedError.message,
      });
      newResponse.code(translatedError.statusCode);
      return newResponse;
    }

    if (!translatedError.isServer) {
      return h.continue;
    }

    const newResponse = h.response({
      status: STATUS_ERROR,
      message: SERVER_ERROR_MESSAGE,
    });
    newResponse.code(500);
    return newResponse;
  }

  return h.continue;
};

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([{ plugin: Jwt }]);

  configureAuthStrategy(server);

  server.route({
    method: "GET",
    path: "/",
    handler: () => ({ value: "Hello world!" }),
  });

  await registerPlugins(server, container);

  server.ext("onPreResponse", handleErrors);

  return server;
};

module.exports = createServer;
