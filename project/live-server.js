const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// In-memory store for match state
const liveMatchState = {};

// POST /matches/:matchId/live - update live match data
app.post("/matches/:matchId/live", (req, res) => {
  const { matchId } = req.params;
  const { score1, score2, keikuka1, keikuka2, time } = req.body;

  liveMatchState[matchId] = {
    score1,
    score2,
    keikuka1,
    keikuka2,
    time,
  };

  console.log(`✔️ Updated live match ${matchId}`, liveMatchState[matchId]);
  res.sendStatus(200);
});

// GET /matches/:matchId/live - fetch live match data
app.get("/matches/:matchId/live", (req, res) => {
  const { matchId } = req.params;
  const state = liveMatchState[matchId];

  if (!state) {
    return res.status(404).json({ error: "No live state found for this match" });
  }

  res.json(state);
});

// Health check (optional)
app.get("/", (req, res) => {
  res.send("Live Scoreboard Sync Server is running 🚀");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🟢 Live sync server listening at http://localhost:${PORT}`);
});
