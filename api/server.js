const express = require("express");
const configureMiddleware = require("./configureMiddleware.js");

const { authenticate } = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");

const server = express();
configureMiddleware(server);

server.use("/api/auth", authRouter);
server.use("/api/jokes", jokesRouter);
// server.use("/api/jokes", authenticate, jokesRouter);

server.get("/api", (req, res) => {
  res.json({ message: `API Working!!!!!` });
});

module.exports = server;
