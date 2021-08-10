const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const { handleRegister } = require("./controllers/register");
const { handleSignIn } = require("./controllers/signin");
const { handleProfile } = require("./controllers/profile");
const { handleImage, handleApiCall } = require("./controllers/image");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = require("knex")({
	client: "pg",
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	},
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json("it is working");
});

app.post("/signin", handleSignIn(db, bcrypt));

app.post("/register", (req, res) => handleRegister(req, res, db, bcrypt));

app.get("/profile/:id", (req, res) => handleProfile(req, res, db));

app.put("/image", (req, res) => handleImage(req, res, db));
app.post("/imageurl", (req, res) => handleApiCall(req, res));

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});
