// liveSocketServer.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let matchData = {}; // Store latest state keyed by matchId

io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("updateMatch", (payload) => {
    const { matchId } = payload;
    matchData[matchId] = payload;
    io.emit(`liveUpdate-${matchId}`, payload);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

const PORT = 3002;
server.listen(PORT, () => console.log(`🚀 Live socket server running on port ${PORT}`));
