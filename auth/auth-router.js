const router = require("express").Router();
console.log("auth-router.js");

const { authorize, verifyNewUser } = require("./authenticate-middleware.js");

const {
  createUser,
  userLogin,
  getAllUsers
} = require("../controllers/apiControllers.jsx");

// registration
router.route("/register").post(createUser);

// login
router.route("/login").post(userLogin);
// router.route("/login").post(authorize,userLogin)

// getusers
router.route("/users").get(getAllUsers);

module.exports = router;
