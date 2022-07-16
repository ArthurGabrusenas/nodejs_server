import {
  addUserProduct,
  deleteUserProduct,
  getUserProducts,
  updateUserProduct,
  userAuthorization,
  userRegistration,
} from "../endpoint-handlers/index.js";

const routes = [
  {
    path: "/authorization",
    method: "post",
    callback: (request) => userAuthorization(request),
  },
  {
    path: "/registration",
    method: "post",
    callback: (request) => userRegistration(request),
  },
  {
    path: "/user/:userId/update/product/:productId",
    method: "post",
    callback: (request) => updateUserProduct(request),
  },
  {
    path: "/user/:userId/delete/product/:productId",
    method: "delete",
    callback: (request) => deleteUserProduct(request),
  },
  {
    path: "/user/:userId/add/product",
    method: "post",
    callback: (request) => addUserProduct(request),
  },
  {
    path: "/user/:userId/get/products",
    method: "get",
    callback: (request) => getUserProducts(request),
  },
];

export { routes };
