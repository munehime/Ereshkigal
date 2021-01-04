import chalk from "chalk";
import moment from "moment";

import { Console } from "console";

export default class Log extends Console {
	constructor(client) {
		super(process.stdout, process.stderr);

		Object.defineProperty(this, "client", { value: client });
	}

	print(content, type = "log") {
		type = type.toLowerCase();
		const timestamp = `[${moment().format("YYYY/MM/DD HH:mm:ss")}]:`;
		super[this.TYPE[type]](chalk[this.COLORS[type]](`${timestamp} ${content}`));
	}

	log(...args) {
		this.print(...args);
	}

	error(...args) {
		this.print(...args, "error");
	}

	warn(...args) {
		this.print(...args, "warn");
	}

	debug(...args) {
		this.print(...args, "debug");
	}

	ready(...args) {
		this.print(...args, "ready");
	}

	TYPE = {
		log: "log",
		debug: "debug",
		error: "error",
		warn: "warn",
		ready: "log",
	};

	COLORS = {
		log: "whiteBright",
		debug: "blueBright",
		error: "redBright",
		warn: "yellowBright",
		ready: "greenBright",
	};
}
