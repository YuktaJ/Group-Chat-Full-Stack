const socketService = (socket) => {
    socket.on("new-group-message", (groupId, text) => {
        console.log(groupId, text, "Yh ID hai!");
        socket.broadcast.emit("group-message", groupId, text);
    })
};
module.exports = socketService