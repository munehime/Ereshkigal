export default class Uitls {
	constructor(client) {
		this.client = client;
	}

	help(message, name) {
		let found = false;
		this.client.commands.some((cmd) => {
			let command = cmd.command;
			if (!Array.isArray(command)) command = [command];
			if (command.includes(name.toLowerCase())) {
				if (cmd.hidden) return true;
				const desc = [`**${command[0]}**`];
				if (cmd.description) desc.push(`${cmd.description}`);

				const fields = [];
				if (cmd.usage) {
					fields.push({
						name: "**Usages**",
						value: `\`${this.client.config.prefix}${command[0]} ${cmd.usage}\``,
					});

					if (cmd.example) {
						const examples = [];
						for (let i = 0; i < cmd.example.length; i++) {
							examples.push(
								`\`${this.client.config.prefix}${command[0]} ${cmd.example[i].run}\`\n${cmd.example[i].result}\n`,
							);
						}

						fields.push({
							name: "**Examples**",
							value: examples,
						});
					}
				}

				if (Array.isArray(cmd.command)) {
					fields.push({
						name: "**Aliases**",
						value: `\`${cmd.command
							.slice(1)
							.map((c) => c)
							.join("`, `")}\``,
					});
				}

				const embed = {
					author: {
						name: `${this.client.user.username}'s Help Menu`,
						icon_url: this.client.user.displayAvatarURL(),
					},
					color: "#e6c333",
					description: desc.join("\n"),
					fields: fields,
				};

				message.channel.send({ embed: embed });
				found = true;
				return true;
			}
		});

		if (found) return true;
		return false;
	}

	getEmote(emoteName, guild) {
		let emote;

		if (guild)
			emote = guild.emojis.cache.find(
				(emoji) => emoji.name.toLowerCase() === emoteName.toLowerCase(),
			);

		if (!emote)
			emote = this.client.emojis.cache.find(
				(emoji) => emoji.name.toLowerCase() === emoteName.toLowerCase(),
			);

		return emote;
	}
}
