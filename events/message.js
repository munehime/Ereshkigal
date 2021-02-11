import Event from "../utils/structures/event.js";

const emojiList = ["🍵", "☕", "🥧"];
const regex = {
	timestamp: new RegExp(/(\d+):(\d{2}):(\d{3})\s*(\(((\d\,?)+)\))?/i),
	beatmap: new RegExp(
		/(osu|old)\.ppy\.sh\/(s|b|beatmaps|beatmapsets)\/(\d+)(#(osu|taiko|fruits|mania)\/(\d+))?/i,
	),
};

export default class extends Event {
	async run(message) {
		try {
			if (message.author.bot) return;

			if (emojiList.includes(message.content))
				return message.channel.send(message.content);

			const [user, guild] = await Promise.all([
				this.client.db.user.findOne({
					id: message.author.id,
				}),
				this.client.db.guild.findOne({
					id: message.guild.id,
				}),
			]);

			if (
				message.content.match(
					new RegExp(`^<@!?${this.client.user.id}>( |)$`),
				)
			) {
				if (!user && !guild)
					return message.channel.send(
						`My prefix is: \`${this.client.config.prefix}\``,
					);

				if (user)
					return message.channel.send(
						`My prefix is: \`${user.prefix}\``,
					);

				return message.channel.send(`My prefix: \`${guild.prefix}\``);
			}

			const args = message.content.trim().split(/ +/g);

			if (
				!args[0].startsWith(
					(user || guild || this.client.config).prefix,
				)
			) {
				if (args[0].match(regex.timestamp))
					return this.client.osu.sendTimestamp(
						message,
						regex.timestamp,
					);

				if (message.content.match(regex.beatmap))
					return this.client.osu.getBeatmap(
						message,
						args,
						regex.beatmap,
					);

				if (message.attachments.size > 0) {
					if (message.attachments.first().name.includes(".osz"))
						return this.client.osu.getAudioByOszFile(
							message,
							message.attachments.first(),
						);
				}

				if (
					message.channel.nsfw &&
					(message.content.includes("https://nhentai.net/g/") ||
						args[0].match(/^[0-9]*$/gm))
				)
					return this.client.nhentai.printBook(message, args[0]);

				return;
			}

			args[0] = args[0].slice(
				(user || guild || this.client.config).prefix.length,
			);

			const msg = args.join(" ").toLowerCase();

			for (const [key, cmd] of this.client.commands) {
				if (!key.includes(args[0])) continue;

				if (this.checkCommand(msg, cmd, args))
					this.runCommand(cmd, { message, args });
			}
		} catch (err) {
			this.client.console.error(err);
		}
	}

	checkCommand(msg, command, args) {
		if (command.category == "Dev" || command.hidden) {
			if (message.author.id !== process.env.BOT_OWNER_ID) return false;
		}

		let cmdMatch = false,
			isStartsWith = false,
			commands = command.command;

		if (command.startsWith) isStartsWith = true;
		if (!Array.isArray(commands)) commands = [commands];

		commands.some((cmd) => {
			if (isStartsWith) {
				if (msg.startsWith(cmd)) {
					cmdMatch = true;
					return true;
				}
			} else if (msg.startsWith(cmd + " ") || msg === cmd) {
				cmdMatch = true;
				return true;
			}
		});

		if (cmdMatch) {
			if (
				command.argsRequired !== 0 &&
				args.length <= command.argsRequired
			)
				return false;

			return true;
		}

		return false;
	}

	async runCommand(command, obj) {
		try {
			await command.run(obj);
		} catch (err) {
			this.client.console.error(err);
		}
	}
}
