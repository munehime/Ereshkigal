import Command from "../../utils/structures/command.js";

export default class Prefix extends Command {
	constructor(...args) {
		super(...args, {
			command: "prefix",
			category: "Settings",
			description: "Get or change bot's prefix.",
			usage: "[prefix]",
			example: [
				{
					run: "",
					result: "Get bot's prefix.",
				},
				{
					run: "?",
					result: "Change bot's prefix to **?**.",
				},
			],
		});
	}

	async run(obj) {
		const { message } = obj;

		if (!args[1])
			return message.channel.send(
				`My prefix is: \`${this.client.config.prefix}\``,
			);

            
	}
}
