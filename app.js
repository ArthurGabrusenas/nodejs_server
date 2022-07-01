const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3100;
const upload = multer();
const bodyParser = require("body-parser");

const mockDataPath = {
  users: "./mock-data/users.json",
};

const routes = {
  users: "/users",
  userProductUpdate: "/user/:userId/update/products/:productId",
  userProductDelete: "/user/:userId/delete/products/:productId",
  userProducts: "/user/:userId/products",
};

//  helpers //
function getData(path) {
  const data = require(path);

  return data;
}

function writeDataInJSON(file, data) {
  fs.writeFile(file, JSON.stringify(data), "utf8", (err) => {
    if (err) {
      throw err;
    }
  });
}

function getId(arr) {
  let arrIdList = [];

  arr.map((item) => {
    arrIdList.push(item.id);
  });

  const maxId = Math.max(...arrIdList);

  return maxId + 1;
}
////

function addUserProduct(request) {
  const paramsUserId = Number(request.params.userId);
  let savedUsers = getData(mockDataPath.users);

  const id = getId(savedUsers.users[paramsUserId].products);

  const addedProduct = {
    id: id,
    ...request.body,
  };

  savedUsers.users.map((user) => {
    if (paramsUserId === user.id) {
      user.products.push(addedProduct);
    }
  });

  try {
    writeDataInJSON(mockDataPath.users, savedUsers);

    const updatedProductList = getData(mockDataPath.users).users[paramsUserId]
      .products;

    return updatedProductList;
  } catch (err) {
    console.log(err);
    return "err add";
  }
}

function deleteUserProduct(request) {
  const paramsUserId = Number(request.params.userId);
  const paramsProductId = Number(request.params.productId);

  const savedUsers = getData(mockDataPath.users);

  const udpatedProductList = savedUsers.users[paramsUserId].products.filter(
    (product) => {
      return product.id !== paramsProductId;
    }
  );

  savedUsers.users[paramsUserId].products = udpatedProductList;

  try {
    writeDataInJSON(mockDataPath.users, savedUsers);

    const updatedList = getData(mockDataPath.users).users[paramsUserId]
      .products;

    return updatedList;
  } catch (err) {
    console.log(err);
    return "err delete";
  }
}

function updateUserProduct(request) {
  const paramsUserId = Number(request.params.userId);
  const paramsProductId = Number(request.params.productId);
  const savedUsers = getData(mockDataPath.users);
  const appendProduct = request.body;

  savedUsers.users[paramsUserId].products[paramsProductId] = {
    id: paramsProductId,
    ...appendProduct,
  };

  try {
    writeDataInJSON(mockDataPath.users, savedUsers);

    const updatedList = getData(mockDataPath.users).users[paramsUserId]
      .products;

    return updatedList;
  } catch (err) {
    console.log(err);
    return "err update";
  }
}

function putHttpRoute(
  app,
  route,
  method,
  mockData = null,
  resProcessCallback = null
) {
  // TODO configure cors for a personal server
  const corsOptions = {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
    allowedHeaders: "Content-Type",
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };

  app.use(bodyParser.json());

  switch (method) {
    case "post":
      app.post(route, upload.array(), cors(), (req, res) => {
        if (resProcessCallback) {
          const result = resProcessCallback(req);

          res.send(result);
        }
      });

    case "get":
      app.get(route, cors(), (req, res) => {
        res.send(mockData);
      });
    case "delete":
      app.delete(route, (req, res) => {
        if (resProcessCallback) {
          const result = resProcessCallback(req);
          res.send(result);
        }
      });
  }
}

function serverListener(app, port) {
  app.listen(port, () => {
    console.log("server start");
  });
}

putHttpRoute(app, routes.users, "get", getData(mockDataPath.users));

putHttpRoute(app, routes.userProductUpdate, "post", null, updateUserProduct);

putHttpRoute(app, routes.userProducts, "post", null, addUserProduct);

putHttpRoute(app, routes.userProductDelete, "delete", null, deleteUserProduct);

serverListener(app, port);
