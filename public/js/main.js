const socket = io({ transports: ["websocket"], upgrade: false });
socket.emit("username", user);
$("form").submit(function (e) {
	e.preventDefault(); // prevents page reloading
	if ($.trim($("#m").val()) != "") {
		socket.emit("message", {
			msg: $("#m").val(),
			user: user,
		});
	}
	$("#m").val("");
	return false;
});
socket.on("chat message", function ({ msg, user, time }) {
	$("#messages").append(
		$("<li>")
			.addClass("bg-light")
			.append(
				$("<small>")
					.text(user + " ")
					.addClass("username")
			)
			.append($("<small>").text(time))
			.append($("<p>").text(msg))
	);
	$(".right").scrollTop($("#messages").height());
});
socket.on("update users", function (users) {
	document.querySelector(".users").innerHTML = `
		${users.map((user) => `<li>${user.username}</li>`).join("")}
	`;
});
