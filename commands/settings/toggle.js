import Command from "../../utils/structures/command.js";
import fs from "fs-extra";

export default class Toggle extends Command {
	constructor(...args) {
		super(...args, {
			command: "toggle",
			category: "Settings",
			description: "Toggle one feature.",
			usage: "<options...>",
			argsRequired: 1,
			example: [
				{
					run: "autoinfo",
					result: "Toggle auto info feature.",
				},
			],
		});
	}

	async run(obj, cb) {
		const { message, args } = obj;

		try {
			if (message.content.includes(" -autoinfo")) {
				const newSettings = {
					channel_id: message.channel.id,
					auto_info: false,
				};

				const found = this.client.channelsSettings.some((channel) => {
					if (message.channel.id === channel.channel_id) {
						channel.auto_info = !channel.auto_info;
						return true;
					}
				});

				if (!found)
					await this.client.channelsSettings.push(newSettings);

				fs.writeFile(
					"database/channels/settings.json",
					JSON.stringify(this.client.channelsSettings, null, 2),
					(err) => {
						if (err) this.client.console.error(err);
					},
				);

				return cb(
					null,
					`${
						newSettings.auto_info ? "Turn on" : "Turn off"
					} auto info in this channel!`,
				);
			}
		} catch (err) {
			this.client.console.error(err);
		}
	}
}
