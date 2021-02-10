const db = require(".");

db.mongoose
	.connect("mongodb://localhost:27017/webdev-hackathon", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Successfully connected to MongoDB.");
	})
	.catch((err) => console.error(err));
