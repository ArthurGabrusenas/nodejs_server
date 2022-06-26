const express = require("express");
const app = express();
const cors = require("cors");
const port = 3100;

const mockDataPath = {
  users: "./mock-data/users.json",
};

const routes = {
  users: "/users",
  user: "/user/:id",
};

function getData(path) {
  const data = require(path);

  return data;
}

function putHttpRoute(app, route, method, mockData = null) {
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
      app.post(route, cors(), (req, res) => {
        // TODO give the updated user object
        // TODO change file with users
        res.send(`${route}, ${req.params.id}`);
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

putHttpRoute(app, routes.user, "post");

serverListener(app, port);
