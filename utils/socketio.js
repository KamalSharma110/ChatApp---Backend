const socketio = require("socket.io");

const { base_url } = require("../config");

let io;

module.exports = {
  init: (httpServer) => {
    io = socketio(httpServer, {
      cors: {
        origin: base_url,
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    });
    return io;
  },
  getIO: () => {
    if (io) return io;
    else throw new Error("Socket was not initialized");
  },
};
