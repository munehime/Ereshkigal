import dotenv from "dotenv";
dotenv.config();

import Ereshkigal from "./utils/structures/ereshkigal.js";

const client = new Ereshkigal({
	messageCacheMaxSize: 100,
	messageCacheLifetime: 240,
	messageSweepInterval: 300,
});

process.setMaxListeners(0);

client.login(process.env.BOT_TOKEN);

process.on("unhandledRejection", (err) =>
	console.error("Uncaught Promise Rejection", err),
);
