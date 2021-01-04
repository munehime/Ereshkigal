import Store from "../store.js";

export default class CommandStore extends Store {
	constructor(client) {
		super(client, "commands");
	}

	get(command) {
		return super.get(command);
	}

	has(command) {
		return super.has(command);
	}

	set(command) {
		super.set(command);
		return command;
	}

	delete(command) {
		const exists = this.get(command);
		if (!exists) return;

		return super.delete(command);
	}

	clear() {
		return super.clear();
	}
}
