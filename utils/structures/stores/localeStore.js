import Store from "../store.js";

export default class LocaleStore extends Store {
	constructor(client) {
		super(client, "locales");
	}

	get(locale) {
		return super.get(locale);
	}

	has(locale) {
		return super.has(locale);
	}

	set(locale) {
		super.set(locale);
		return locale;
	}

	delete(locale) {
		const exists = this.get(locale);
		if (!exists) return;

		return super.delete(locale);
	}

	clear() {
		return super.clear();
	}
}
