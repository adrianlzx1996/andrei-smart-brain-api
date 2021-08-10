const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const { handleRegister } = require("./controllers/register");
const { handleSignIn } = require("./controllers/signin");
const { handleProfile } = require("./controllers/profile");
const { handleImage, handleApiCall } = require("./controllers/image");

const db = require("knex")({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "qwopaskl",
		database: "smart-brain",
	},
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json(db.users);
});

app.post("/signin", handleSignIn(db, bcrypt));

app.post("/register", (req, res) => handleRegister(req, res, db, bcrypt));

app.get("/profile/:id", (req, res) => handleProfile(req, res, db));

app.put("/image", (req, res) => handleImage(req, res, db));
app.post("/imageurl", (req, res) => handleApiCall(req, res));

app.listen(3000, () => {
	console.log("app is running on port 3000");
});
