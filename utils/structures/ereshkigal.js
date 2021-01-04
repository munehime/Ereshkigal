import { Client } from "discord.js";

import CommandstStore from "./stores/commandStore.js";
import EventStore from "./stores/eventStore.js";
import LocaleStore from "./stores/localeStore.js";

import Console from "./log.js";
import Utils from "../utils.js";
import Osu from "./osu.js";

import config from "../../config.js";

export default class Ereshkigal extends Client {
	constructor(options) {
		super(options);

		this.config = config;

		this.console = new Console(this);
		this.utils = new Utils(this);
		this.osu = new Osu(this);

		this.commands = new CommandstStore(this);
		this.events = new EventStore(this);
		this.locales = new LocaleStore(this);
	}

	async login(token) {
		await this.init();
		return super.login(token);
	}

	async init() {
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
