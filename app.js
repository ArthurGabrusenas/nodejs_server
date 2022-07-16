import { routes } from "./routes/index.js";
import express from "express";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";

// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const fs = require("fs");
const app = express();
const port = 3100;
const upload = multer();
// const bodyParser = require("body-parser");

app.use(bodyParser.json());

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

routes.forEach((route) => {
  const path = route.path;
  const method = route.method;
  const callback = route.callback;

  putHttpRoute(app, path, method, callback);
});

app.listen(port, () => {
  console.log("server start");
});
