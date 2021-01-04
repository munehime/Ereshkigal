import Command from "../../utils/structures/command.js";

export default class Reload extends Command {
	constructor(...args) {
		super(...args, {
			command: "reload",
			description: "Reload a command or event.",
			argsRequired: 1,
			usage: "<command | event>",
			category: "System",
			hidden: true,
			permLevel: "Bot Admin",
		});
	}

	async run(obj) {
		const { message, args } = obj;

		const file = this.resolveFile(args[1]);
		if (!file)
			return message.channel.send(
				"Cannot find a command or event with that name.",
			);

		try {
			await file.value.reload();
			return message.channel.send(
				`Successfully reloaded \`${file.key[0]}\``,
			);
		} catch (err) {
			file.store.set(file);
			return message.channel.send(
				`There was an error while reloading \`${file.key[0]}: ${err.message}\``,
			);
		}
	}

	resolveFile(file) {
		const isCommand = this.getFile(file, "commands");
		if (isCommand) return isCommand;

		const isEvent = this.getFile(file, "events");
		if (isEvent) return isEvent;

		return false;
	}

	getFile(file, type) {
		for (const [key, value] of this.client[type]) {
			if (!key.includes(file)) continue;
			return { key, value };
		}
	}
}
