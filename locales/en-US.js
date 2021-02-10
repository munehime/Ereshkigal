import Locale from "../utils/structures/locales.js";

const data = {
	hello: "Hello",
	ping: (ms) => `**Pong!!!\nCurrent latency is ${ms} ms.**`,
};

export default class EN extends Locale {
	translate(key, ...args) {
		const translation = data[key];
		if (typeof translation === "function") return translation(args);
		else return translation;
	}
}
