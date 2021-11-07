const handleProfile = (req, res, db) => {
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
};

const handleProfileUpdate = (req, res, db) => {
	const { id } = req.params;
	const { name, age, pet } = req.body.formInput;

	db("users")
		.where({ id })
		.update({
			name,
			age,
			pet,
		})
		.then((response) => {
			if (response) {
				res.json("success");
			} else res.status(400).json("Unable to update");
		})
		.catch((err) => res.status(400).json("error updating user"));
};

module.exports = {
	handleProfile,
	handleProfileUpdate,
};
