function findUser(id, users) {
  return users.find((user) => user.id === id);
}

export { findUser };
