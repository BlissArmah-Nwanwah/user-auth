const express = require("express");
const http = require("http");
const user = require("./routes/user");
const quizzes = require("./routes/quizzes");
const connectDB = require("./db/connect");
const axios = require("axios");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const app = express();

require("dotenv").config();
// middleware
app.use(express.json());

app.set("trust proxy", 1);
 
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/", (req, res) => {
  res.send("user auth");
});

const webSocket = require("ws");
const server = require("http").createServer(app);
const wss = new webSocket.Server({ server: server });
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  ws.on("message", async function message(data) {
    if (data.toString("utf-8").trim() === "getCoin") {
      const cryptoData = await axios.get(
        "https://api.coinranking.com/v2/coins?limit=10"
      );
      setInterval(() => {
        ws.send(JSON.stringify(cryptoData.data));
      }, 3000);
    }
    if (data.toString("utf-8").trim() === "") {
      const cryptoData = await axios.get(
        "https://api.coinranking.com/v2/coins"
      );
      setInterval(() => {
        ws.send(JSON.stringify(cryptoData.data));
      }, 2000);
    }
  });
  ws.send('something');

});



app.use("/api/v1/user", user);
app.use("/api/v1/quiz", quizzes);


const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, console.log(`server is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
}; 


start();

module.exports = app;