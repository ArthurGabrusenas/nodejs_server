import { getUserData, saveUserData } from "../helpers/index.js";

function updateUserProduct(request) {
  // TODO добавить проверку на обновление не существующего продукта
  const paramsUserId = Number(request.params.userId);
  const paramsProductId = Number(request.params.productId);
  const savedUsers = getUserData();
  const appendProduct = request.body;

  savedUsers[paramsUserId].products[paramsProductId] = {
    id: paramsProductId,
    ...appendProduct,
  };

  try {
    saveUserData({ users: savedUsers });

    const updatedList = getUserData();

    return updatedList[paramsUserId].products;
  } catch (err) {
    console.log(err);
    return "err update";
  }
}

export { updateUserProduct };
