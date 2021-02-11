import mongoose from "mongoose";
mongoose.Promise = global.Promise;

export default {
	mongoose,
	user: (await import("./schema/users.js")).default,
	guild: (await import("./schema/guilds.js")).default,
};
