import { generateUserId, getUserData, saveUserData } from "../helpers/index.js";

function addUserProduct(request) {
  const paramsUserId = Number(request.params.userId);
  let savedUsers = getUserData();

  const id = generateUserId(savedUsers[paramsUserId].products);

  const addedProduct = {
    id: id,
    ...request.body,
  };

  savedUsers.map((user) => {
    if (paramsUserId === user.id) {
      user.products.push(addedProduct);
    }
  });

  try {
    saveUserData({ users: savedUsers });

    const updatedProductList = getUserData()[paramsUserId].products;

    return updatedProductList;
  } catch (err) {
    console.log(err);
    return "err add";
  }
}

export { addUserProduct };
