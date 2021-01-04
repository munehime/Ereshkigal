import { Collection } from "discord.js";
import fs from "fs-nextra";
import path from "path";

export default class Store extends Collection {
	constructor(client, name) {
		super();

		this.client = client;
		this.name = name;
		this.dir = path.resolve(name);
	}

	set(file) {
		let name = file.name || file.command;

		if (!Array.isArray(name)) name = [name];

		const exists = this.get(name);
		if (exists) this.delete(name);

		super.set(name, file);
		return file;
	}

	delete(file) {
		const exists = this.get(file.name);
		if (!exists) return;

		return super.delete(file.name, file);
	}

	async load(filepath) {
		try {
			const File = (await import(`file:///${filepath}`)).default;
			const file = this.set(
				new File(this.client, {
					path: filepath,
					name: path.parse(filepath).name,
				}),
			);

			return file;
		} catch (err) {
			this.client.console.error(err);
		}
	}

	async loadFiles() {
		try {
			this.clear();

			const files = await fs.scan(this.dir, {
				filter: (stats, paths) =>
					stats.isFile() && paths.endsWith(".js"),
			});
			return await Promise.all(
				[...files.keys()].map((file) => this.load(file)),
			);
		} catch (err) {
			this.client.console.error(err);
		}
	}
}
