const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = http.createServer(app);
const cookieParser = require("cookie-parser");

const { Server } = require("socket.io");
const io = new Server(server);

app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "../bidding/dist")));

app.get("/", (req, res) => {
  // const uniqueCookie = generateUniqueCookie(); // Implement your logic to generate a unique cookie
  // res.cookie("uniqueCookie", uniqueCookie, { maxAge: 900000, httpOnly: true }); // Set the cookie with a maximum age
  res.sendFile(path.resolve(__dirname, "../bidding/dist/index.html"));
});

let countdown = 100;
let countdownInterval = setInterval(() => {
  countdown--;

  if (countdown >= 0) {
    io.emit("countdown", countdown);
  }

  if (countdown === 0) {
    io.emit("countdownend");
    clearInterval(countdownInterval);
    countdown = 20; // Reset countdown to 20
    countdownInterval = setInterval(countdownFunction, 1000); // Restart countdown
  }
}, 1000);
const countdownFunction = () => {
  countdown--;

  if (countdown >= 0) {
    io.emit("countdown", countdown);
  }

  if (countdown === 0) {
    io.emit("countdownend");
    clearInterval(countdownInterval);
    countdown = 20; // Reset countdown to 20
    countdownInterval = setInterval(countdownFunction, 1000); // Restart countdown
  }
};
// Event listener to reset countdown
// Initialize user number

let cookiesArray = [];
io.on("connection", (socket) => {
  // Initialize an array to store cookies

  // Handle the unique cookie received from the client
  socket.on("updateUserId", (uniqueCookie) => {
    console.log(cookiesArray);
    console.log("Received cookie from client:", uniqueCookie);

    // Check if the cookie already exists in the array
    const index = cookiesArray.indexOf(uniqueCookie);

    // If the cookie is not in the array, push it and emit the index
    if (index === -1) {
      cookiesArray.push(uniqueCookie);
      io.emit("userClickedUpdate", `${cookiesArray.length}`);
    } else {
      // If the cookie already exists, emit its index
      io.emit("userClickedUpdate", `${index + 1}`);
    }
  });

  socket.on("resetCountdown", () => {
    countdown = 20;
    io.emit("countdown", countdown);
  });

  // Handle user disconnection
  // socket.on("disconnect", () => {
  //   userNumber--; // Decrement user number when a user disconnects
  // });
});

server.listen(9000, () => console.log("Listening on 9000"));
