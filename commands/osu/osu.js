import Command from "../../utils/structures/command.js";

export default class Osu extends Command {
	constructor(...args) {
		super(...args, {
			command: "osu",
			category: "osu!",
			description: "Show infomation of osu! player.",
			argsRequired: 1,
			usage: "[username | id]",
		});
	}

	async run(obj) {
		const { message, args } = obj;

		this.client.osu.printUserProfile(message, args[1], (err, data) => {
			if (err) return message.channel.send(`${err}`);

			return message.channel.send({ embed: data });
		});
	}
}
