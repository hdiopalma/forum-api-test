// utils.js
const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require("./ServerInjectionFunctionHelper");

const addUserAndGetAccessToken = async (server, userPayload, loginPayload) => {
  await server.inject({
    method: "POST",
    url: "/users",
    payload: userPayload,
  });

  const authResponse = await server.inject({
    method: "POST",
    url: "/authentications",
    payload: loginPayload,
  });

  const {
    data: { accessToken },
  } = JSON.parse(authResponse.payload);

  return accessToken;
};

module.exports = {
  addUserAndGetAccessToken,
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
};
