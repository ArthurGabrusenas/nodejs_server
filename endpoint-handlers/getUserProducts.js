import { findUser, getUserData } from "../helpers/index.js";

function getUserProducts(request) {
  const paramsUserId = Number(request.params.userId);
  const users = getUserData();

  const result = findUser(paramsUserId, users).products;

  return result;
}

export { getUserProducts };
