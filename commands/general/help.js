import Command from "../../utils/structures/command.js";

export default class Help extends Command {
	constructor(...args) {
		super(...args, {
			command: "help",
			description: "Check bot's latency.",
			category: "General",
		});
	}

	async run(obj) {
		const { message } = obj;
	}
}
