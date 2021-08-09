const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
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

app.post("/signin", (req, res) => {
	db.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then((data) => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((res) => res.status(400).json("error signing in"));
			} else {
				res.status(400).json("wrong credentials");
			}
		})
		.catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password);

	db.transaction((trx) => {
		trx.insert({
			hash,
			email,
		})
			.into("login")
			.returning("email")
			.then((loginEmail) => {
				return trx("users")
					.returning("*")
					.insert({
						name: name,
						email: loginEmail[0],
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => {
						res.status(400).json("Unable to register");
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	});
});

app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	db.select("*")
		.from("users")
		.where({
			id,
		})
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("not found");
			}
		});
});

app.put("/image", (req, res) => {
	const { id } = req.body;

	db("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then((entries) => {
			if (entries.length) res.json(entries[0]);
			else res.status(400).json("not found");
		})
		.catch((err) => res.status(400).json("unable to get entries"));
});

app.listen(3000, () => {
	console.log("app is running on port 3000");
});
