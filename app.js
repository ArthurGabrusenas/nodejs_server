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

// TODO update routes {path, methood, handler}
const routes = {
  userRegistration: "/user",
  userProductUpdate: "/user/:userId/update/products/:productId",
  userProductDelete: "/user/:userId/delete/products/:productId",
  userProductAdd: "/user/:userId/add/product",
  userProductsGet: "/user/:userId/get/product",
};

//  helpers //
function getData(path) {
  try {
    const data = fs.readFileSync(path, "utf8");

    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

function writeDataInJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data), "utf8", (err) => {
    if (err) {
      throw err;
    }
  });
}

function getUserData() {
  return getData(mockDataPath.users);

  //TODO если пустой файл то возвращаем валидную структуру, переделать структуру users.json
  // return {
  //   'users': [],
  // }
}

function saveUserData(updatedUsers) {
  return writeDataInJSON(mockDataPath.users, updatedUsers);
}

function generateUserId(arr) {
  // TODO add uuid
  let arrIdList = [];

  arr.map((item) => {
    arrIdList.push(item.id);
  });

  const maxId = Math.max(...arrIdList);

  return maxId + 1;
}

function checkLoginMatching(login, users) {
  const checkLogin = users.findIndex((user) => user.login === login);

  return checkLogin === -1 ? true : false;
}

function findUser(id, users) {
  return users.find((user) => user.id === id);
}
////

function userRegistration(request) {
  const userEmail = request.body.login;
  const userPassword = request.body.password;
  const savedUsers = getUserData();
  const userId = generateUserId(savedUsers.users);
  const loginIsValid = checkLoginMatching(userEmail, savedUsers.users);

  if (loginIsValid) {
    const newUser = {
      id: userId,
      login: userEmail,
      password: userPassword,
      products: [],
    };

    const updatedUsers = {
      users: [...savedUsers.users, newUser],
    };

    saveUserData(updatedUsers);

    const updateSavedUsers = getUserData();

    const result = findUser(userId, updateSavedUsers);

    return result;
  } else {
    return "this user already exists";
  }
}

function addUserProduct(request) {
  const paramsUserId = Number(request.params.userId);
  let savedUsers = getUserData();

  const id = generateUserId(savedUsers.users[paramsUserId].products);

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
    saveUserData(savedUsers);

    const updatedProductList = getUserData()[paramsUserId].products;

    return updatedProductList;
  } catch (err) {
    console.log(err);
    return "err add";
  }
}

function getUserProducts(request) {
  const paramsUserId = Number(request.params.userId);
  const users = getUserData();

  const result = findUser(paramsUserId, users).products;

  return result;
}

function deleteUserProduct(request) {
  const paramsUserId = Number(request.params.userId);
  const paramsProductId = Number(request.params.productId);

  const savedUsers = getUserData();

  const udpatedProductList = savedUsers.users[paramsUserId].products.filter(
    (product) => {
      return product.id !== paramsProductId;
    }
  );

  savedUsers.users[paramsUserId].products = udpatedProductList;

  try {
    saveUserData(savedUsers);

    const updatedList = getUserData().users[paramsUserId].products;

    return updatedList;
  } catch (err) {
    console.log(err);
    return "err delete";
  }
}

function updateUserProduct(request) {
  const paramsUserId = Number(request.params.userId);
  const paramsProductId = Number(request.params.productId);
  const savedUsers = getUserData();
  const appendProduct = request.body;

  savedUsers[paramsUserId].products[paramsProductId] = {
    id: paramsProductId,
    ...appendProduct,
  };

  try {
    saveUserData(savedUsers);

    const updatedList = getUserData();

    return updatedList[paramsUserId].products;
  } catch (err) {
    console.log(err);
    return "err update";
  }
}

function putHttpRoute(app, route, method, resProcessCallback = null) {
  // TODO configure cors for a personal server
  const corsOptions = {
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
    allowedHeaders: "Content-Type",
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };

  switch (method) {
    case "post":
      app.post(route, upload.array(), cors(), (req, res) => {
        const result = resProcessCallback(req);

        res.send(result);
      });
    case "get":
      app.get(route, cors(), (req, res) => {
        const result = resProcessCallback(req);

        res.send(result);
      });
    case "delete":
      app.delete(route, (req, res) => {
        const result = resProcessCallback(req);
        res.send(result);
      });
  }
}

app.use(bodyParser.json());

putHttpRoute(app, routes.userProductsGet, "get", getUserProducts);

putHttpRoute(app, routes.userProductUpdate, "post", updateUserProduct);

putHttpRoute(app, routes.userProductAdd, "post", addUserProduct);

putHttpRoute(app, routes.userProductDelete, "delete", deleteUserProduct);

putHttpRoute(app, routes.userRegistration, "post", userRegistration);

app.listen(port, () => {
  console.log("server start");
});
