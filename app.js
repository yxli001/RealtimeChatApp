const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

var port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index");
});

io.on("connection", (socket) => {
	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});
});

http.listen(port, () => {
	console.log("Server running on port 3000...");
});
