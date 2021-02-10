import Locale from "../utils/structures/locales.js";

const data = {
	hello: "Xin chào",
	ping: (ms) => `**Pong!!!\nĐộ trể hiện tại là ${ms} ms.**`,
};

export default class VI extends Locale {
	translate(key, ...args) {
		const translation = data[key];
		if (typeof translation === "function") return translation(args);
		else return translation;
	}
}
