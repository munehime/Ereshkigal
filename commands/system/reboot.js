import Command from "../../utils/structures/command.js";

export default class Reboot extends Command {
	constructor(...args) {
		super(...args, {
			command: "reboot",
			category: "System",
			description: "Restart the bot.",
			hidden: true,
			permLevel: "Bot Admin",
		});
	}

	async run(obj) {
		const { message } = obj;
		
		try {
			await message.channel.send("Rebooting...");
			process.exit(1);
		} catch (err) {
			this.client.console.error(err);
		}
	}
}
