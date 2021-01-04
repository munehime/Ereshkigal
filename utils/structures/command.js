import { Permissions } from "discord.js";

export default class Command {
	constructor(client, file, options = {}) {
		this.client = client;
		this.command = options.command || file.name;
		this.startsWith = options.startsWith || false;
		this.argsRequired = options.argsRequired || 0;
		this.description = options.description;
		this.usage = options.usage || "";
		this.category = options.category || "";
		this.hidden = options.hidden || false;
		this.guildOnly = options.guildOnly || true;
		this.botPerms = new Permissions(options.botPerms || []).freeze();
		this.permLevel = options.permLevel || "User";
		this.file = file;
		this.store = this.client.commands;
	}

	async run(obj) {
		const cmd = this.constructor.command;
		if (!Array.isArray(cmd)) cmd = [cmd];
		throw new Error(`Command ${cmd[0]} doesn't provide a run method.`);
	}

	reload() {
		return this.store.load(this.file.path);
	}
}
