export default class Locales {
	constructor(client, file) {
		this.client = client;
		this.name = file.name;
		this.file = file;
		this.store = this.client.locales;
	}
}
