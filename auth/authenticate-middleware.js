/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const users = require("../utils/db-model.js");
const bcrypt = require("bcryptjs");
const secrets = require("../utils/secrets.js");
const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const { username, password } = req.body;
  // const { username, password } = req.headers;
  console.log("authenticate:", req.body, req.session, req.headers);
  // validate that they exist ... we didn't have this part in class...
  if (!(username && password)) {
    res.status(401).json({ message: "invalid Inputs" });
  } else {
    users
      .findBy({ username })
      .first()
      .then(user => {
        let boolRet = bcrypt.compareSync(password, user.password);
        if (user && boolRet) {
          req.session.user = user;
          req.session.loggedin = true;
          next();
        } else {
          res.status(401).json({ you: "shall not pass!" });
        }
      })
      .catch(err => {
        res.status(500).json({ Errmessage: `${err}` });
      });
  }
};

exports.verifyNewUser = (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    users.findBy({ username }).then(user => {
      console.log("verifyNewUser.findBy:", user, user.length);
      if (!user || user.length === 0) {
        next();
      } else {
        res
          .status(400) //error
          .json({ message: "username already exists" });
      }
    });
  } else {
    console.log("veryifyNewUser name/pass fails");
    res
      .status(400) //error
      .json({ message: "username and password fields required" });
  }
};

exports.restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    console.log("restricted: token exists:\n");
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log("restricted: jwt.verify error:\n", err, decodedToken);
        res
          .status(401)
          .json({ message: "authorization failed. Token is different" });
      } else {
        console.log("restricted: jwt.verify no error:\n", decodedToken);
        if (req.params.id) {
          if (decodedToken.subject == req.params.id) {
            next();
          } else {
            res.status(401).json({ message: "You do not have access" });
          }
        } else {
          next();
        }
      }
    });
  }
};
