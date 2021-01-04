import Command from "../../utils/structures/command.js";

export default class Say extends Command {
	constructor(...args) {
		super(...args, {
			command: "say",
			description: "Make bot say something.",
			argsRequired: 2,
			usage: "<channel id> <text>",
			category: "Staff",
		});
	}

	async run(obj) {
		const { args } = obj;

		const channel = this.client.channels.cache.get(args[1]);
		const msg = args.slice(2).join(" ");

		channel.send(msg);
	}
}
