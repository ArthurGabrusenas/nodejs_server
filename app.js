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
  return getData(mockDataPath.users).users;

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

function userAuthorization(request) {
  const userLogin = request.body.login;
  const userPassword = request.body.password;
  const savedUsers = getUserData();

  const user = savedUsers.find((user) => user.login === userLogin);
  const password = user && user.password === userPassword;

  if (user) {
    if (password) {
      delete user.password;

      return user;
    } else {
      return {
        status: "invalidPassword",
      };
    }
  } else {
    return {
      status: "userNotFound",
    };
  }
}

function userRegistration(request) {
  const userEmail = request.body.login;
  const userPassword = request.body.password;
  const savedUsers = getUserData();

  const userId = generateUserId(savedUsers);
  const loginIsValid = checkLoginMatching(userEmail, savedUsers);

  if (loginIsValid) {
    const newUser = {
      id: userId,
      login: userEmail,
      password: userPassword,
      products: [],
    };

    const updatedUsers = {
      users: [...savedUsers, newUser],
    };

    saveUserData(updatedUsers);

    const updateSavedUsers = getUserData();

    const result = findUser(userId, updateSavedUsers);

    delete result.password;

    return result;
  } else {
    return "this user already exists";
  }
}

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

function getUserProducts(request) {
  const paramsUserId = Number(request.params.userId);
  const users = getUserData();

  const result = findUser(paramsUserId, users).products;

  return result;
}

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

function putHttpRoute(app, route, method, resProcessCallback) {
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

routes.forEach((route) => {
  const path = route.path;
  const method = route.method;
  const callback = route.callback;

  putHttpRoute(app, path, method, callback);
});

app.listen(port, () => {
  console.log("server start");
});
