import Locale from "../utils/structures/locales.js";

export default class VI extends Locale {
	data = {
		ping: (ms) => `**Pong!!!\nĐộ trể hiện tại là ${ms} ms.**`,
	};

	async translate(key, ...args) {
		const translation = data[key];
		if (typeof translation === "function") return translation(args);
		else return translation;
	}
}
