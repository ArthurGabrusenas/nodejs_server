function checkLoginMatching(login, users) {
  const checkLogin = users.findIndex((user) => user.login === login);

  return checkLogin === -1 ? true : false;
}

export { checkLoginMatching };
