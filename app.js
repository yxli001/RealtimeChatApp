const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Variables
let users = [];

// Root route
app.get("/", (req, res) => {
    res.render("index");
});

// Chat form post route
app.post("/", (req, res) => {
    let username = req.body.username;
    res.redirect("/chat?username=" + username);
});

// Chat route
app.get("/chat", (req, res) => {
    res.render("chat", { user: req.query.username });
});

// sanitizes input
function preventXXS(str) {
    return str.split("<").join("&lt;").split(">").join("&gt;");
}

// When a client connects
io.on("connection", (socket) => {
    // Emits welcome message to the new connected user
    socket.emit("chat message", {
        msg: "Welcome to World Wide Chat!",
        user: "Bot",
        time: moment().format("h:mm a"),
    });

    // When frontend emits the username of the new client
    socket.on("username", (username) => {
        // Push new user to array
        users.push({ username: preventXXS(username), socketId: socket.id });

        // Tell the frontend to update users list
        io.emit("update users", users);

        // Emits message to all other users
        socket.broadcast.emit("chat message", {
            msg: users[users.length - 1].username + " has connected",
            user: "Bot",
            time: moment().format("h:mm a"),
        });
    });

    // When receive a message from a client
    socket.on("message", ({ msg, user }) => {
        // Add the time to the message and emit it to all clients
        io.emit("chat message", { msg, user, time: moment().format("h:mm a") });
    });

    // When the connected client disconnects
    socket.on("disconnect", () => {
        // Emits a message to all clients
        const user = users.find((user) => {
            return user.socketId == socket.id;
        });

        if (user === undefined) {
            return;
        }
        io.emit("chat message", {
            msg: user.username + " has disconnected",
            user: "Bot",
            time: moment().format("h:mm a"),
        });
        users = users.filter((user) => user.socketId != socket.id);
        io.emit("update users", users);
    });
});

// get port
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log("Server running on port 3000...");
});
