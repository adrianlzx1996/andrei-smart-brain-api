const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const morgan = require("morgan");

const { handleRegister } = require("./controllers/register");
const { handleSignIn, signInAuthentication } = require("./controllers/signin");
const { handleProfile, handleProfileUpdate } = require("./controllers/profile");
const { handleImage, handleApiCall } = require("./controllers/image");
const { requireAuth } = require("./controllers/authorization");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = require("knex")({
	client: "pg",
	connection: {
		// connectionString: process.env.DATABASE_URL,
		// ssl: true,
		connectionString: process.env.POSTGRES_URL,
		// ssl: true,
		// host: process.env.POSTGRES_HOST,
		// user: process.env.POSTGRES_USER,
		// password: process.env.POSTGRES_PASSWORD,
		// database: process.env.POSTGRES_DB,
	},
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/", (req, res) => res.json("it is working"));
// app.post("/signin", handleSignIn(db, bcrypt));
app.post("/signin", signInAuthentication(db, bcrypt));
app.post("/register", (req, res) => handleRegister(req, res, db, bcrypt));
app.get("/profile/:id", requireAuth, (req, res) => handleProfile(req, res, db));
app.post("/profile/:id", requireAuth, (req, res) =>
	handleProfileUpdate(req, res, db)
);
app.put("/image", requireAuth, (req, res) => handleImage(req, res, db));
app.post("/imageurl", requireAuth, (req, res) => handleApiCall(req, res));

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT || 3000}`);
});
