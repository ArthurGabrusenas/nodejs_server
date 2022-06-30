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
  userProduct: "/user/:userId/products/:productId",
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
////

function addUserProduct(request) {
  const appendUserId = Number(request.params.userId);
  let savedUsers = getData(mockDataPath.users);
  const addedProduct = {
    id: savedUsers.users[appendUserId].products.length,
    ...request.body,
  };

  savedUsers.users.map((user) => {
    if (appendUserId === user.id) {
      user.products.push(addedProduct);
    }
  });

  try {
    writeDataInJSON(mockDataPath.users, savedUsers);

    const updatedProductList = getData(mockDataPath.users).users[appendUserId]
      .products;

    return updatedProductList;
  } catch (err) {
    console.log(err);
    return "err add";
  }
}

function updateUserProduct(request) {
  const appendUserId = Number(request.params.userId);
  const appendProductId = Number(request.params.productId);
  const savedUsers = getData(mockDataPath.users);
  const appendProduct = request.body;

  savedUsers.users[appendUserId].products[appendProductId] = {
    id: appendProductId,
    ...appendProduct,
  };

  try {
    writeDataInJSON(mockDataPath.users, savedUsers);

    const updatedList = getData(mockDataPath.users).users[appendUserId]
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
  }
}

function serverListener(app, port) {
  app.listen(port, () => {
    console.log("server start");
  });
}

putHttpRoute(app, routes.users, "get", getData(mockDataPath.users));

putHttpRoute(app, routes.userProduct, "post", null, updateUserProduct);

putHttpRoute(app, routes.userProducts, "post", null, addUserProduct);

serverListener(app, port);
