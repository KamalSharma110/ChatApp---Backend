const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { getDb } = require("../utils/database");
const Chat = require("../models/Chat");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    error.statusCode = 422;
    error.message = error.msg;
    throw error;
  }

  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      let imagePath = req.file?.path;
      if(!imagePath) throw new Error("Please provide a profile picture");

      imagePath = imagePath.replace("\\", "/");
      const user = new User(
        req.body.name,
        req.body.email,
        hashedPassword,
        imagePath
      );
      user.createUser().then(() => {
        res.status(201).json({
          message: "User is created successfully.",
        });
      });
    })
    .catch((err) => next(err));
};

exports.getUser = (req, res, next) => {
  User.getUserById(req.body.localId)
    .then((result) => {
      res.status(200).json({
        localId: result._id.toString(),
        displayName: result.name,
        photoUrl: result.image,
      });
    })
    .catch((err) => next(err));
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0];
    error.statusCode = 422;
    error.message = error.msg;
    throw error;
  }

  User.getUserByEmail(req.body.email)
    .then((user) => {
      if (!user) {
        const error = new Error(
          "No account associated with this email is found"
        );
        error.statusCode = 401;
        throw error;
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error("Wrong Password");
            error.statusCode = 401;
            throw error;
          }

          const token = jwt.sign(
            { userId: user._id.toString() },
            "supersecretkey",
            {
              expiresIn: "1h",
            }
          );

          res.status(200).json({
            token: token,
            userId: user._id.toString(),
            message: "Login Successful",
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.searchUsers = (req, res, next) => {
  User.searchUsers(req.query.name)
    .then((users) => {
      users = users.filter(
        (user) => user._id.toString() !== req.body.currentUserId
      );

      Chat.getRecentChats(req.body.currentUserId)
        .then((result) => {
          let recentChats = [];
          if(result) recentChats = result.recentChats;

          users = users.filter((user) =>
            recentChats.findIndex(
              (chat) => user._id.toString() === chat.userInfo.localId
            ) >= 0
              ? false
              : true
          );

          res.status(200).json({ users: users });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
