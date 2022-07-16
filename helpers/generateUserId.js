function generateUserId(arr) {
  // TODO add uuid
  let arrIdList = [];

  arr.map((item) => {
    arrIdList.push(item.id);
  });

  const maxId = Math.max(...arrIdList);

  return maxId + 1;
}

export { generateUserId };
