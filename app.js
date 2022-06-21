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

function putHttpRoute(route, method, mockData) {
  switch (method) {
    case "post":
      app.post(route, (req, res) => {
        res.send(mockData);
      });
      break;

    default:
      app.get(route, (req, res) => {
        res.send(mockData);
      });
  }
}

putHttpRoute(routes.users, "post", getData(mockDataPath.users));

app.listen(port);
