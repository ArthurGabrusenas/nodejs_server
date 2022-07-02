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
  users: "/users",
  userRegistration: "/user",
  userProductUpdate: "/user/:userId/update/products/:productId",
  userProductDelete: "/user/:userId/delete/products/:productId",
  userProducts: "/user/:userId/products",
};

//  helpers //
function getData(path) {
  try {
    const data = fs.readFileSync(path, "utf8");

    return data;
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
////

function userRegistration(request) {
  const userEmail = request.body.login;
  const userPassword = request.body.password;
  const savedUsers = getUserData();
  const userId = generateUserId(JSON.parse(savedUsers).users);

  const newUser = {
    id: userId,
    login: userEmail,
    password: userPassword,
    products: [],
  };

  const updatedUsers = {
    users: [...JSON.parse(savedUsers).users, newUser],
  };

  saveUserData(updatedUsers);

  const updateSavedUsers = JSON.parse(getUserData());

  const result = updateSavedUsers.users.find((user) => {
    return user.id === userId;
  });

  return result;
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
    writeDataInJSON(mockDataPath.users, savedUsers);

    const updatedProductList = getUserData().users[paramsUserId].products;

    return updatedProductList;
  } catch (err) {
    console.log(err);
    return "err add";
  }
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
    writeDataInJSON(mockDataPath.users, savedUsers);

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

  savedUsers.users[paramsUserId].products[paramsProductId] = {
    id: paramsProductId,
    ...appendProduct,
  };

  try {
    writeDataInJSON(mockDataPath.users, savedUsers);

    const updatedList = getUserData().users[paramsUserId].products;

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

app.use(bodyParser.json());

// TODO putHttpRoute(app, routes.users, "get", getUserData());
// putHttpRoute(app, routes.users, "get", null, () => {
//   getUserData();
// });

putHttpRoute(app, routes.userProductUpdate, "post", null, updateUserProduct);

putHttpRoute(app, routes.userProducts, "post", null, addUserProduct);

putHttpRoute(app, routes.userProductDelete, "delete", null, deleteUserProduct);

putHttpRoute(app, routes.userRegistration, "post", null, userRegistration);

app.listen(port, () => {
  console.log("server start");
});
