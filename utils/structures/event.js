export default class Event {
	constructor(client, file) {
		this.client = client;
		this.name = file.name;
		this.file = file;
		this.store = this.client.events;
	}

	async call(...args) {
		try {
			await this.run(...args);
		} catch (err) {
			this.client.console.error(err);
		}
	}

	reload() {
		return this.store.load(this.file.path);
	}
}
