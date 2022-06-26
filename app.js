const express = require("express");
const multer = require("multer");
const cors = require("cors");
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
////

function addUserProduct(request) {
  const appendUserId = Number(request.params.userId);
  let savedUsers = getData(mockDataPath.users);
  const addedProduct = {
    id: savedUsers.users[appendUserId].products.length,
    ...request.body,
  };

  const newProductsObject = savedUsers.users.map((user) => {
    if (appendUserId === user.id) {
      user.products.push(addedProduct);
    }
  });

  // TODO write a newProductsObject object to a file
}

function updateUserProduct(request) {
  const appendUserId = Number(request.params.userId);
  const appendProductId = Number(request.params.productId);
  const savedUsers = getData(mockDataPath.users);
  const appendProduct = request.body;

  const newProductObject = (savedUsers.users[appendUserId].products[
    appendProductId
  ] = {
    ...appendProduct,
  });

  // TODO write a newProductObject object to a file
}

function putHttpRoute(
  app,
  route,
  method,
  mockData = null,
  resProcessCallback = null,
  sendMessage
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
          resProcessCallback(req);
        }

        res.send(sendMessage);
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

putHttpRoute(
  app,
  routes.userProduct,
  "post",
  null,
  updateUserProduct,
  "product update success"
);

putHttpRoute(
  app,
  routes.userProducts,
  "post",
  null,
  addUserProduct,
  "product add success"
);

serverListener(app, port);
