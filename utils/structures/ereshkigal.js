import { Client } from "discord.js";

import CommandStore from "./stores/commandStore.js";
import EventStore from "./stores/eventStore.js";
import LocaleStore from "./stores/localeStore.js";

import Console from "./log.js";
import Utils from "../utils.js";
import Osu from "./osu.js";
import NHentai from "./nhentai.js";

import config from "../../config.js";
import db from "../../models/index.js";

export default class Ereshkigal extends Client {
	constructor(options) {
		super(options);

		this.config = config;
		this.db = db;

		this.console = new Console(this);
		this.utils = new Utils(this);
		this.osu = new Osu(this);
		this.nhentai = new NHentai(this);

		this.commands = new CommandStore(this);
		this.events = new EventStore(this);
		this.locales = new LocaleStore(this);
	}

	async login(token) {
		await this.init();
		return super.login(token);
	}

	async init() {
		this.db.mongoose
			.connect(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log("Successfully connected to MongoDB.");
			})
			.catch((err) => console.error(err));

		const [commands, events, locales] = await Promise.all([
			this.commands.loadFiles(),
			this.events.loadFiles(),
			this.locales.loadFiles(),
		]);
		this.osu.init();

		this.console.log(`Loaded ${commands.length} commands.`);
		this.console.log(`Loaded ${events.length} events.`);
		this.console.log(`Loaded ${locales.length} locales.`);
	}
}
