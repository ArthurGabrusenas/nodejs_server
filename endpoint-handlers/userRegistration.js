import {
  checkLoginMatching,
  findUser,
  generateUserId,
  getUserData,
  saveUserData,
} from "../helpers/index.js";

function userRegistration(request) {
  const userEmail = request.body.login;
  const userPassword = request.body.password;
  const savedUsers = getUserData();

  const userId = generateUserId(savedUsers);
  const loginIsValid = checkLoginMatching(userEmail, savedUsers);

  if (loginIsValid) {
    const newUser = {
      id: userId,
      login: userEmail,
      password: userPassword,
      products: [],
    };

    const updatedUsers = {
      users: [...savedUsers, newUser],
    };

    saveUserData(updatedUsers);

    const updateSavedUsers = getUserData();

    const result = findUser(userId, updateSavedUsers);

    delete result.password;

    return result;
  } else {
    return "this user already exists";
  }
}

export { userRegistration };
