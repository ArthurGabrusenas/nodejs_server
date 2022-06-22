const express = require("express");
const app = express();
const port = 3100;

const mockDataPath = {
  users: "./mock-data/users.json",
};

const routes = {
  users: "/users",
};

function getData(path) {
  const data = require(path);

  return data;
}

function putHttpRoute(app, route, method, mockData) {
  switch (method) {
    case "post":
      app.post(route, (req, res) => {
        res.send(mockData);
      });

    case "get":
      app.get(route, (req, res) => {
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

serverListener(app, port);
