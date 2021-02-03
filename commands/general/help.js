import Command from "../../utils/structures/command.js";
import _ from "lodash";
import fs from "fs-extra";

export default class Help extends Command {
	constructor(...args) {
		super(...args, {
			command: "help",
			category: "General",
			description:
				"Display commands list or specific help for one command.",
			usage: "[command]",
			example: [
				{
					run: "",
					result: "Display commands list.",
				},
				{
					run: "help",
					result: "Display specific help for help command.",
				},
			],
		});
	}

	async run(obj) {
		const { message, args } = obj;

		if (!args[1]) {
			const fields = [];
			const categories = (() =>
				fs
					.readdirSync("commands", { withFileTypes: true })
					.filter((dirent) => dirent.isDirectory())
					.map((dirent) =>
						dirent.name === "osu" ? "osu!" : dirent.name,
					))();

			categories.map((category) => {
				if (["system", "dev"].includes(category.toLowerCase())) return;

				const field = {
					name: category == "osu!" ? "osu!" : _.startCase(category),
					value: this.client.commands
						.filter(
							(cmd) =>
								cmd.category.toLowerCase() === category &&
								!cmd.hidden,
						)
						.map((cmd) => {
							if (!Array.isArray(cmd)) cmd = [cmd];

							return `\`${cmd[0]}\``;
						})
						.join(" "),
					inline: true,
				};
				fields.push(field);
			});

			const embed = {
				author: {
					name: `${this.client.user.username}'s Commands List`,
					icon_url: this.client.user.displayAvatarURL(),
				},
				color: "#e6c333",
				fields: fields,
			};

			return message.channel.send({ embed: embed });
		}

		const found = this.client.utils.help(message, args[1]);
		if (!found) return message.channel.send("Unknown Command.");
	}
}
