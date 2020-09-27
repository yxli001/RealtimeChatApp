const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

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

http.listen(3000 || process.env.PORT, () => {
	console.log("Server running on port 3000...");
});
