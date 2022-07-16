import { getUserData, saveUserData } from "../helpers/index.js";

function deleteUserProduct(request) {
  // TODO добавить проверку на удаление продукта которого нет.

  const paramsUserId = Number(request.params.userId);
  const paramsProductId = Number(request.params.productId);

  const savedUsers = getUserData();

  const udpatedProductList = savedUsers[paramsUserId].products.filter(
    (product) => product.id !== paramsProductId
  );

  savedUsers[paramsUserId].products = udpatedProductList;

  try {
    saveUserData({ users: savedUsers });

    const updatedList = getUserData()[paramsUserId].products;

    return updatedList;
  } catch (err) {
    console.log(err);
    return "err delete";
  }
}

export { deleteUserProduct };
