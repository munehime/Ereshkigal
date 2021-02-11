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
					run: "-g",
					result: "Get bot's prefix in this guild.",
				},
				{
					run: "?",
					result: "Change bot's prefix to **?**.",
				},
				{
					run: "! -g",
					result: "Change bot's prefix to **!** in this guild.",
				},
			],
		});
	}

	async run(obj) {
		const { message, args } = obj;

		try {
			const [user, guild] = await Promise.all([
				this.client.db.user.findOne({
					id: message.author.id,
				}),
				this.client.db.guild.findOne({
					id: message.guild.id,
				}),
			]);

			if (!args[1]) {
				if (!user && !guild)
					return message.channel.send(
						`My prefix is: \`${this.client.config.prefix}\``,
					);

				if (message.content.includes("-g"))
					return message.channel.send(
						`My prefix in this guild is: \`${guild.prefix}\``,
					);

				return message.channel.send(`My prefix is: \`${user.prefix}\``);
			}

			if (!message.content.includes("-g")) {
				const newPrefix = new this.client.db.user({
					id: message.author.id,
					prefix: args[1],
				});

				try {
					await newPrefix.save();
					return message.channel.send(
						`Changed my prefix to: \`${args[1]}\``,
					);
				} catch (err) {
					this.client.console.error(err);
				}
			}

			const newPrefix = new this.client.db.guild({
				id: message.guild.id,
				prefix: args[1],
			});

			await newPrefix.save();
			return message.channel.send(
				`Changed my prefix in this guild to: \`${args[1]}\``,
			);
		} catch (err) {
			this.client.console.error(err);
		}
	}
}
