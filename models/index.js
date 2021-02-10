const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = db = {
	mongoose,
	user: require("./schema/users.js"),
	guild: require("./schema/guilds.js"),
};
