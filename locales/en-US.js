import Locale from "../utils/structures/locales.js";

export default class EN extends Locale {
	data = {
		ping: (ms) => `**Pong!!!\nCurent latency is ${ms} ms.**`,
	};

	async translate(key, ...args) {
		const translation = data[key];
		if (typeof translation === "function") return translation(args);
		else return translation;
	}
}
