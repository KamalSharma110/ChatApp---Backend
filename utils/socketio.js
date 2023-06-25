const socketio = require('socket.io');
let io;

module.exports = {
    init: httpServer => {
        io = socketio(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST", "PUT", "DELETE"]
            }
        });
        return io;
    },
    getIO: () => {
        if(io) return io;
        else throw new Error('Socket was not initialized');
    }
};
