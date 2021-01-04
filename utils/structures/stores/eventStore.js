import Store from "../store.js";

export default class EventStore extends Store {
	constructor(client) {
		super(client, "events");
	}

	set(event) {
		super.set(event);
		this.client.on(event.name, event.call.bind(event));
		return event;
	}

	delete(event) {
		const exists = this.get(event);
		if (!exists) return;

		this.client.removeAllListner(exists.name);
		return super.delete(exists.name);
	}

	clear() {
		for (const event of this.keys()) {
			this.delete(event);
		}
	}
}
