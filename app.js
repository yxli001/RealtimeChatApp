const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

var port = 3000 || process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("index");
});

let users = [];

app.post("/", (req, res) => {
	let username = req.body.username;
	res.redirect("/chat?username=" + username);
});

app.get("/chat", (req, res) => {
	users.push(req.query.username);

	res.render("chat", { user: users, user: req.query.username });
});

io.on("connection", (socket) => {
	io.emit("chat message", {
		msg: users[users.length - 1] + " has connected",
		user: "Bot",
	});
	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});
	socket.on("disconnect", () => {
		io.emit("chat message", {
			msg: users[users.length - 1] + " has disconnected",
			user: "Bot",
		});
		users.pop();
	});
});

http.listen(port, () => {
	console.log("Server running on port 3000...");
});
