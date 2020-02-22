const router = require("express").Router();
console.log("auth-router.js");

const { authenticate, verifyNewUser } = require("./authenticate-middleware.js");

const {
  createUser,
  userLogin,
  getAllUsers,
  logout
} = require("../controllers/apiControllers.jsx");

// registration
router.route("/register").post(createUser);

// login
router.route("/login").post(authenticate, userLogin);

//logout
router.route("/logout").delete(logout);

// userInfo
router.route("/users").get(getAllUsers);

module.exports = router;
