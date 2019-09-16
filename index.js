const express = require("express");

const server = express();

// Inform that JSON will be used
server.use(express.json);

// Query params ?
// Route params /users/1
// Request Body

// CRUD - Create, Remove, Update, Delete

const users = ["Evandro", "Abreu", "Oliveira"];

// Middleware Global

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Method: ${req.method}; URL: ${req.url}`);
  next();
  console.log("Request");
});

// Middleware local, check name in body
function checkUsersExists(req, res, next) {
  if (req.body.name) {
    return res.status(400).json({ error: "User name is required!" });
  }
  return next();
}

// Middleware local, check user
function checkUserInArray(req, res, next) {
  const { user } = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists!" });
  }
  // modify the req
  req.user = user;
  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  //const { index } = req.params;
  //res.json({ message: `user found: ${users[index]}` });
  return res.json(req.user);
});

server.post("/users", checkUsersExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUsersExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.send("OK");
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return req.send();
});
server.listen(4999);
server.listen(3000);
