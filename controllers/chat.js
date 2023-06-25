const Chat = require("../models/Chat");
const getIO = require("../utils/socketio").getIO;

exports.getRecentChats = (req, res, next) => {
  Chat.getRecentChats(req.params.userId)
    .then((result) => {
      res.status(200).json({ recentChats: result?.recentChats });
    })
    .catch((err) => next(err));
};

exports.sendChat = (req, res, next) => {
  const io = getIO();

  if (req.file) {
    let imagePath = req.file.path;
    imagePath = imagePath.replace("\\", "/");
    req.body.imagePath = imagePath;
  }

  Chat.sendChat(req.body)
    .then(() => {
        return Chat.updateRecentChats(
          req.body.senderId,
          req.body.combinedId,
          req.body.text
        );
    })
    .then(() => {
        return Chat.updateRecentChats(
          req.body.localId,
          req.body.combinedId,
          req.body.text
        );
      })
    .then(() => {
        io.emit("msg_update", {
          text: req.body.text,
          image: req.body.imagePath,
          senderId: req.body.senderId,
          localId: req.body.localId,
          date: req.body.date,
        });

        io.emit("lastMsg_update", {
          message: req.body.text,
          localId: req.body.localId,
          senderId: req.body.senderId,
        });

        res
          .status(201)
          .json({ message: "Message stored successfully on the server" });
    })
    .catch((err) => next(err));
};

exports.getChats = (req, res, next) => {
  Chat.getChats(req.body.combinedId)
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.createRecentChats = (req, res, next) => {
  const io = getIO();
  Chat.createRecentChats(req.body)
    .then(() => {
      io.emit('user_added', {
        currentUserId: req.body.currentUserId,
        localId: req.body.localId,
        displayName: req.body.displayName,
        photoUrl: req.body.photoUrl,
        date: req.body.date,
      });
      res.status(201).json({ message: "Successful!" })
    })
    .catch((err) => next(err));
};

exports.createChat = (req, res, next) => {
  Chat.createChat(req.body.combinedId)
    .then(() => res.status(201).json({ message: "Success!" }))
    .catch((err) => next(err));
};
