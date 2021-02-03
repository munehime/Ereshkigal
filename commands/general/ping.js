import Command from "../../utils/structures/command.js";

export default class Ping extends Command {
	constructor(...args) {
		super(...args, {
			command: "ping",
			category: "General",
			description: "Check bot's latency.",
		});
	}

	async run(obj) {
		const { message } = obj;

		const msg = await message.channel.send("**Pong!!!**");
		msg.edit(
			`**Pong!!!\nCurrent latency is ${
				msg.createdTimestamp - message.createdTimestamp
			}ms.**`,
		);
	}
}
