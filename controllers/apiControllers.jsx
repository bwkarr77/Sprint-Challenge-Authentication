console.log("userControllers");

const jwt = require("jsonwebtoken");
const Users = require("../utils/db-model.js");
const secrets = require("../utils/secrets.js");

const generateToken = user => {
  const payload = {
    //list of "claims"; aka permissions for user
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1h"
  };
  console.log("generateToken: \n", payload, secrets.jwtSecret, options);
  return jwt.sign(payload, secrets.jwtSecret, options);
};

// ================================
//            POST
// ================================
// @desc    POST/CREATE new user
// @route   POST to /api/auth/register
exports.createUser = (req, res, next) => {
  let user = req.body;
  console.log("userController.createUser", user);

  Users.add(user)
    .then(newUser => {
      console.log("createUser");
      const newUserToken = generateToken(newUser);
      res
        .status(201) //success
        .json({
          SuccessMessage: `${newUser.username}`,
          token: `${newUserToken}`
        });
    })
    .catch(err => {
      res
        .status(500) //error
        .json({ errMessage: `createUser error: ${err}` });
    });
};

// ================================
//            POST
// ================================
// @desc    login with credentials in header
// @route   POST to /api/auth/login
exports.userLogin = (req, res, next) => {
  let user = req.body;
  const loginUserToken = generateToken(user);

  console.log(
    "userControllers>userLogin:",
    req.session,
    "\nloginUserToken:",
    loginUserToken
  );
  res.status(200).json({
    message: `Login success ${user.username}!!!`,
    token: `${loginUserToken}`
  });
};

// ================================
//            GET
// ================================
// @desc    GET to obtain all users
// @route   GET to /api/users
exports.getAllUsers = (req, res, next) => {
  console.log("getAllUsers");
  Users.find()
    .orderBy("id")
    .then(users => {
      console.log("getAllUser.then(users):", users);
      res
        .status(200) //success
        .json(users);
    })
    .catch(err => {
      res
        .status(500) //server error
        .json({ errMessage: `${err}` });
    });
};

// ================================
//            DELETE
// ================================
// @desc    DELETE to logout current user (since we are destroying req.session)
// @route   DELETE to /api/logout
exports.logout = (req, res, next) => {
  console.log("logout>pre", req.session);
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res
          .send(401) //error
          .json({ errMessage: "Logout errors for days!" });
      } else {
        res
          .status(202) //success (?)
          .json({ message: "successful logout" });
      }
    });
  } else {
    res.end();
  }
};

// ================================
//            DELETE
// ================================
// @desc    DELETE to logout current user (since we are destroying req.session)
// @route   DELETE to /api/logout
exports.deleteUser = (req, res, next) => {
  console.log("deleteUser started...");
  const { id } = req.params;
  Users.remove(id)
    .then(deletedUser => {
      console.log("userController.deletedUser:", deletedUser);
      res
        .status(200) //success
        .json({ successfulMessage: `You have deleted ${id}` });
    })
    .catch(err => {
      res
        .status(500) //
        .json({ deleteErr: "could not delete user", error: err });
    });
};

exports.updateUser = async (req, res, next) => {
  console.log("updateUser ran....", req.body);
  const { id } = req.params;
  const { username, password, department } = req.body;
  try {
    let updatedUser;
    if (password) {
      const newPass = bcrypt.hashSync(password, 14);
      updatedUser = await Users.update(id, {
        username: username,
        password: newPass,
        department: department
      });
    } else {
      updatedUser = await Users.update(id, {
        username: username,
        department: department
      });
    }
    res
      .status(200) //success
      .json(updatedUser);
  } catch (err) {
    console.log("updatedUser.err:", err);
    res
      .status(500) //fail
      .json({ updateErr: "could not update user info" });
  }
};

function matchDepartment(token) {
  let department = null;
  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (!err) {
        department = decodedToken.department;
      }
    });
  }
  return department;
}
