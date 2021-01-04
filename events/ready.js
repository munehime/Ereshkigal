import Event from "../utils/structures/event.js";

export default class extends Event {
	async run() {
		this.client.console.ready("Connected!")
		this.client.user.setActivity(
			"Đại học Bách Ngành - Đại học Quốc gia osu!",
			{
				type: "PLAYING",
			},
		);
	}
}
