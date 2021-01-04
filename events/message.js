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
		if (message.author.bot) return;

		if (emojiList.includes(message.content))
			return message.channel.send(message.content);

		if (
			message.content.match(
				new RegExp(`^<@!?${this.client.user.id}>( |)$`),
			)
		)
			return message.reply(
				`My prefix is: \`${this.client.config.prefix}\``,
			);

		const args = message.content.trim().split(/ +/g);

		if (!args[0].startsWith(this.client.config.prefix)) {
			if (args[0].match(regex.timestamp)) {
				return this.client.osu.sendTimestamp(message, regex.timestamp);
			}

			if (message.content.match(regex.beatmap))
				return this.client.osu.getBeatmap(message, args, regex.beatmap);

			if (message.attachments.size > 0) {
				if (message.attachments.first().name.includes(".osz"))
					return this.client.osu.getAudioByOszFile(message, message.attachments.first());
			}

			if (
				message.channel.nsfw &&
				(message.content.includes("https://nhentai.net/g/") ||
					args[0].match(/^[0-9]*$/gm))
			)
				return;

			return;
		}

		args[0] = args[0].slice(this.client.config.prefix.length);

		const msg = args.join(" ").toLowerCase();

		for (const [key, cmd] of this.client.commands) {
			if (!key.includes(args[0])) continue;

			if (this.checkCommand(msg, cmd, args)) {
				this.runCommand(cmd, { message, args });
			}
		}
	}

	checkCommand(msg, command, args) {
		if (command.category == "Dev") {
			if (message.author.id !== "203699280261808138") {
				return false;
			}
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
