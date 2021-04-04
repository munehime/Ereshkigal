import chalk from "chalk";
import moment from "moment";
import { inspect } from "util";

import { Console } from "console";

export default class Log extends Console {
	constructor(client) {
		super(process.stdout, process.stderr);

		Object.defineProperty(this, "client", { value: client });
	}

	print(content, type = "log") {
		type = type.toLowerCase();
		content = this.parseContent(content);
		
		const timestamp = `[${moment().format("YYYY/MM/DD HH:mm:ss")}]:`;
		super[this.TYPE[type]](
			chalk.hex([this.COLORS[type]])(`${timestamp} ${content}`),
		);
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

	parseContent(content) {
		if (Array.isArray(content))
			return content.map(this.parseContent).join("\n");

		if (typeof content === "object" && content !== null)
			return inspect(content, { depth: 0, colors: true });

		if (content && content.constructor === Error)
			return content.stack || content.message || String(content);

		return String(content);
	}

	TYPE = {
		log: "log",
		debug: "debug",
		error: "error",
		warn: "warn",
		ready: "log",
	};

	COLORS = {
		log: "#FFFFFF",
		debug: "#0066FF",
		error: "#E10600",
		warn: "#ECE81A",
		ready: "#2FF924",
	};
}
