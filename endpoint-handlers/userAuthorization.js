import { getUserData } from "../helpers/index.js";

function userAuthorization(request) {
  const userLogin = request.body.login;
  const userPassword = request.body.password;
  const savedUsers = getUserData();

  const user = savedUsers.find((user) => user.login === userLogin);
  const password = user && user.password === userPassword;

  if (user) {
    if (password) {
      delete user.password;

      return user;
    } else {
      return {
        status: "invalidPassword",
      };
    }
  } else {
    return {
      status: "userNotFound",
    };
  }
}

export { userAuthorization };
