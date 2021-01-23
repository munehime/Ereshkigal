import Event from "../utils/structures/event.js";

const SECONDS_IN_A_DAY = 60 * 60 * 1000 * 24;
let cl, daysTo, daysFrom;

export default class extends Event {
	async run() {
		this.client.console.ready("Connected!");
		this.client.user.setActivity(
			"Đại học Bách Ngành - Đại học Quốc gia osu!",
			{
				type: "PLAYING",
			},
		);

		cl = this.client;
		await countDownToTime("2021-06-25");
		await countTimePassed("2020-04-22");
	}
}

async function countDownToTime(time) {
	time = new Date(time).getTime();
	var now = new Date(),
		time = new Date(time),
		timeDifference = time - now;

		daysTo = Math.floor((timeDifference / SECONDS_IN_A_DAY) * 1);

	cl.channels
		.fetch("743812798592581694")
		.then((channel) => {
			let day = channel.name.split(" ")[1];
			if (Number(day) !== daysTo) {
				channel.setName(`Còn ${daysTo} ngày`).catch(console.error);
			}
		})
		.catch(console.error);

	clearTimeout(countDownToTime.interval);
	countDownToTime.interval = setTimeout(function () {
		countDownToTime(time);
	}, 3600000);
}

async function countTimePassed(time) {
	time = new Date(time).getTime();
	var now = new Date(),
		time = new Date(time),
		timeDifference = now - time;

		daysFrom = Math.floor((timeDifference / SECONDS_IN_A_DAY) * 1);

	cl.channels
		.fetch("746218203213987941")
		.then((channel) => {
			let day = channel.name.split(" ")[3];
			if (Number(day) !== daysFrom) {
				channel.setName(`Fuck Rem Day ${daysFrom}`).catch(console.error);
			}
		})
		.catch(console.error);

	clearTimeout(countTimePassed.interval);
	countTimePassed.interval = setTimeout(function () {
		countTimePassed(time);
	}, 3600000);
}
