import axios from "axios";
import moment from "moment";
import ojsama from "ojsama";
import fs from "fs-extra";
import unzipper from "unzipper";
import ffmpeg from "ffmpeg-static";

import { MessageAttachment } from "discord.js";
import { spawn } from "child_process";

import "moment-duration-format";

const beatmapRegex = {
	modRegex: new RegExp(/[+]*(\S+)/gi),
	accRegex: new RegExp(/(\S+)\W+/gi),
};

let cl;

export default class Osu {
	constructor(client) {
		this.client = client;
		cl = this.client;
	}

	async init() {
		if (!fs.existsSync("temp")) {
			try {
				fs.mkdirSync("temp");
				fs.mkdirSync("temp/downloads");
				fs.mkdirSync("temp/output");
			} catch (err) {
				reject("error");
				this.client.console.error(err);
			}
		}

		let instance = axios.create({
			baseURL: "https://osu.ppy.sh/api",
		});

		instance.interceptors.request.use((config) => {
			config.params = {
				k: process.env.OSU_TOKEN,
				...config.params,
			};
			return config;
		});

		this.api = instance;

		let access_token = await client_credentials_grant();
		instance = axios.create({
			baseURL: "https://osu.ppy.sh/api/v2",
		});

		instance.interceptors.request.use((config) => {
			config.headers = {
				Authorization: `Bearer ${access_token}`,
				...config.headers,
			};
			return config;
		});

		this.apiv2 = instance;
	}

	getAudioByOszFile(message, attachment) {
		axios
			.get(attachment.url, { responseType: "stream" })
			.then(async (response) => {
				await response.data.pipe(
				await response.data.pipe(
					fs
						.createWriteStream(`temp/downloads/${attachment.name}`)
						.on("finish", () => {
							let input = `temp/downloads/${attachment.name}`;
							let output = `temp/output/${attachment.name.replace(
								".osz",
								"",
							)}`;

							fs.createReadStream(input)
								.pipe(unzipper.Extract({ path: output }))
								.on("finish", () => {
									const mp3File = fs
										.readdirSync(`${output}`)
										.filter((f) => f.endsWith(".mp3"))[0];

									const convert = spawn(ffmpeg, [
										"-i",
										`${output}/${mp3File}`,
										"-b:a",
										"128K",
										`${output}/128K_${mp3File}`,
									]);

									convert.on("close", () => {
										const buffer = fs.readFileSync(
											`${output}/128K_${mp3File}`,
										);

										const attachment = new MessageAttachment(
											buffer,
											"audio.mp3",
										);

										fs.remove(input, (err) => {
											if (err)
												return this.client.console.error(
													err,
												);
										});
										fs.remove(output, (err) => {
											if (err)
												return this.client.console.error(
													err,
												);
										});

										message.channel
											.send(`MP3 Preview:`, attachment)
											.catch((err) =>
												this.client.console.error(err),
											);
									});
								});
						}),
				);
			})
			.catch((err) => this.client.console.error(err));
	}

	sendTimestamp(message, regex) {
		const timestamp = message.content.split(regex);
		return message.channel.send(
			`<osu://edit/${timestamp[1]}:${timestamp[2]}:${timestamp[3]}${
				timestamp[4] ? `-${timestamp[4]}` : ""
			}>`,
		);
	}

	async getBeatmap(message, args, regex) {
		let beatmap_link = args
			.filter(
				(a) =>
					a.startsWith("https://osu.ppy.sh/beatmapsets/") ||
					a.startsWith("https://osu.ppy.sh/b/"),
			)[0]
			.split("/");
		let mods =
			ojsama.modbits.from_string(
				args.filter((a) => a.startsWith("+"))[0] || "",
			) || ojsama.modbits.nomod;

		let params = {};
		if (beatmap_link.includes("beatmapsets") && beatmap_link.length === 5) {
			//https://osu.ppy.sh/beatmapsets/<beatmapset_id>
			params = {
				s: beatmap_link[beatmap_link.length - 1],
			};
		} else {
			// https://osu.ppy.sh/beatmapsets/<beatmapset_id>#<mode>/<beatmap_id> or // https://osu.ppy.sh/b/<beatmap_id>
			params = {
				b: beatmap_link[beatmap_link.length - 1],
			};
		}

		try {
			const beatmap = {};
			let response = await this.api.get("/get_beatmaps", {
				params: params,
			});
			await Object.assign(beatmap, response.data[0]);

			axios
				.get(`https://osu.gatari.pw/d/${beatmap.beatmapset_id}`, {
					responseType: "stream",
				})
				.then(async (response) => {
					await response.data.pipe(
						fs
							.createWriteStream(
								`temp/downloads/${replaceToValidName(
									beatmap.artist,
								)}_-_${replaceToValidName(beatmap.title)}.osz`,
							)
							.on("finish", () => {
								let input = `temp/downloads/${replaceToValidName(
									beatmap.artist,
								)}_-_${replaceToValidName(beatmap.title)}.osz`;
								let output = `temp/output/${replaceToValidName(
									beatmap.artist,
								)}_-_${replaceToValidName(beatmap.title)}`;

								fs.createReadStream(input)
									.pipe(
										unzipper
											.Extract({ path: output })
											.on("error", (err) =>
												console.error(err),
											),
									)
									.on("finish", async () => {
										const mp3File = fs
											.readdirSync(`${output}`)
											.filter((f) =>
												f.endsWith(".mp3"),
											)[0];

										const convert = spawn(ffmpeg, [
											"-i",
											`${output}/${mp3File}`,
											"-b:a",
											"128K",
											`${output}/128K_${mp3File}`,
										]);

										convert.on("close", () => {
											const buffer = fs.readFileSync(
												`${output}/128K_${mp3File}`,
											);

											const attachment = new MessageAttachment(
												buffer,
												"audio.mp3",
											);

											fs.remove(input, (err) => {
												if (err)
													return this.client.console.error(
														err,
													);
											});
											fs.remove(output, (err) => {
												if (err)
													return this.client.console.error(
														err,
													);
											});

											message.channel
												.send(
													`MP3 Preview:`,
													attachment,
												)
												.catch((err) =>
													this.client.console.error(
														err,
													),
												);
										});
									});
							}),
					);
				})
				.catch((err) => this.client.console.error(err));

			response = await axios.get(
				`https://osu.lea.moe/b/${beatmap.beatmap_id}`,
			);

			Object.assign(beatmap, response.data);

			let diff = beatmap.difficulty[mods];
			let pp_fc = [];

			for (let acc = 100; acc >= 95; acc--) {
				const pp = ojsama.ppv2({
					aim_stars: diff.aim,
					speed_stars: diff.speed,
					base_ar: diff.ar,
					base_od: diff.od,
					mods: mods,
					ncircles: beatmap.beatmap.num_circles,
					nsliders: beatmap.beatmap.num_sliders,
					nobjects: beatmap.beatmap.hit_objects,
					max_combo: beatmap.beatmap.max_combo,
					acc_percent: acc,
				});

				pp_fc.push({ acc: acc, pp_total: pp.total });
			}

			const embed = {
				color: "#FF8EE6",
				author: {
					name: `${beatmap.artist} - ${beatmap.title} [${beatmap.version}] mapped by ${beatmap.creator}`,
					icon_url: `http://s.ppy.sh/a/${beatmap.creator_id}`,
					url: `https://osu.ppy.sh/b/${beatmap.beatmap_id}`,
				},
				description: `**Length:** ${moment
					.duration(Number(beatmap.total_length), "seconds")
					.format("m:ss", {
						trim: false,
					})} (${moment
					.duration(Number(beatmap.hit_length), "seconds")
					.format("m:ss", { trim: false })}) **BPM:** ${
					beatmap.bpm
				} **Max Combo:** ${beatmap.max_combo}x\n**Notes:** ${
					beatmap.count_normal
				} **Sliders:** ${beatmap.count_slider} **Spinners:** ${
					beatmap.count_spinner
				}\n**CS:** ${Number(beatmap.diff_size).toFixed(
					1,
				)} **AR:** ${Number(beatmap.diff_approach).toFixed(
					1,
				)} **OD:** ${Number(beatmap.diff_overall).toFixed(
					1,
				)} **HP:** ${Number(beatmap.diff_drain).toFixed(
					1,
				)}\n**SR:** ${Number(beatmap.difficultyrating).toFixed(
					2,
				)} **Aim:** ${Number(beatmap.diff_aim).toFixed(
					2,
				)} **Speed:** ${Number(beatmap.diff_speed).toFixed(
					2,
				)}\n**Ranked Status:** `,
				image: {
					url: `https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover.jpg`,
				},
			};

			//4 = loved, 3 = qualified, 2 = approved, 1 = ranked, 0 = pending, -1 = WIP, -2 = graveyard
			switch (Number(beatmap.approved)) {
				case 1:
					embed.description += "Ranked";
					break;
				case 2:
					embed.description += "Approved";
					break;
				case 3:
					embed.description += "Qualified";
					break;
				case 4:
					embed.description += "Loved";
					break;
				case 0:
					embed.description += "Pending";
					break;
				case -1:
					embed.description += "WIP";
					break;
				default:
					embed.description += "Graveyard";
					break;
			}
			embed.description += "\n\n**PP if FC:**\n";
			for (let i = 0; i < pp_fc.length; i++) {
				embed.description += `**${pp_fc[i].acc}%:** ${pp_fc[
					i
				].pp_total.toFixed(2)}pp `;
				if (i < pp_fc.length - 2) embed.description += "| ";
			}

			return message.channel.send({ embed: embed });
		} catch (err) {
			this.client.console.error(err);
		}
	}

	printUserProfile(message, user, callback) {
		this.validateUser(user, (err, data) => {
			if (err) return callback(err);

			this.apiv2
				.get(`/users/${data.user_id}`)
				.then((response) => {
					const ranked_score = Number(
						data.ranked_score,
					).toLocaleString();
					const total_score = Number(
						data.total_score,
					).toLocaleString();
					const accuracy = Number(data.accuracy).toFixed(2);
					const playcount = Number(data.playcount).toLocaleString();
					const total_hits = Number(
						Number(data.count300) +
							Number(data.count100) +
							Number(data.count50),
					).toLocaleString();
					const total_playtime = `${moment
						.duration(Number(data.total_seconds_played), "seconds")
						.format("d[d] h[h] m[m]")} (${moment
						.duration(Number(data.total_seconds_played), "seconds")
						.format("h[h]")}`;

					let grades = "";
					grades += `${this.getRankEmoji("XH")} ${Number(
						data.count_rank_ssh,
					).toLocaleString()} `;
					grades += `${this.getRankEmoji("X")} ${Number(
						data.count_rank_ss,
					).toLocaleString()} `;
					grades += `${this.getRankEmoji("SH")} ${Number(
						data.count_rank_sh,
					).toLocaleString()} `;
					grades += `${this.getRankEmoji("S")} ${Number(
						data.count_rank_s,
					).toLocaleString()} `;
					grades += `${this.getRankEmoji("A")} ${Number(
						data.count_rank_a,
					).toLocaleString()}`;

					const embed = {
						color: message.member.displayColor,
						thumbnail: {
							url: ` http://s.ppy.sh/a/${data.user_id}`,
						},
						author: {
							name: `${data.username} - ${Number(data.pp_raw)
								.toFixed(2)
								.toLocaleString()} (#${data.pp_rank}) (${
								data.country
							}#${data.pp_country_rank})`,
							icon_url: `https://raw.githubusercontent.com/tmpim/osusig/master/flags/${data.country}.png`,
							url: `https://osu.ppy.sh/users/${data.user_id}`,
						},
						description: `**Ranked Score:** ${ranked_score}\n**Accuracy:** ${accuracy}%\n**Play Count:** ${playcount}\n**Total Score:** ${total_score}\n**Total Hits:** ${total_hits}\n**Total Playtime:** ${total_playtime})\n**Grades:**\t${grades}`,
						image: {
							url: `${response.data.cover_url}`,
						},
						footer: {
							text: `Has been playing for ${moment(
								data.join_date,
							).fromNow(true)} | Joined on ${moment(
								data.join_date,
							).format("LLL")}`,
						},
					};

					return callback(null, embed);
				})
				.catch((err) => {
					this.client.console.error(err);
				});
		});
	}

	validateUser(user, callback) {
		this.api
			.get("/get_user", {
				params: {
					u: user,
				},
			})
			.then((response) => {
				const data = response.data[0];
				if (!data) {
					callback("**User not found!**");
					return false;
				}

				return callback(null, data);
			})
			.catch((error) => {
				this.client.console.error(error);
				if (error.status === "404")
					return callback("**User not found!**");
				else return callback("`Could not access osu! API!`");
			});
	}

	getRankEmoji(rank) {
		switch (rank) {
			case "XH":
				return (
					this.client.utils.getEmote("XH_Rank", null) || "Silver SS"
				);
			case "X":
				return this.client.utils.getEmote("X_Rank", null) || "SS";
			case "SH":
				return (
					this.client.utils.getEmote("SH_Rank", null) || "Silver S"
				);
			case "S":
				return this.client.utils.getEmote("S_Rank", null) || "S";
			case "A":
				return this.client.utils.getEmote("A_Rank", null) || "A";
			case "B":
				return this.client.utils.getEmote("B_Rank", null) || "B";
			case "C":
				return this.client.client.utils.getEmote("C_Rank", null) || "C";
			case "D":
				return this.client.utils.getEmote("D_Rank", null) || "D";
			case "F":
				return this.client.utils.getEmote("F_Rank", null) || "Fail";
		}
	}
}

async function client_credentials_grant() {
	let access_token, expires_in;
	await axios
		.post("https://osu.ppy.sh/oauth/token", {
			client_id: Number(process.env.CLIENT_ID),
			client_secret: process.env.CLIENT_SECRET,
			grant_type: "client_credentials",
			scope: "public",
		})
		.then((response) => {
			access_token = response.data.access_token;
			expires_in = response.data.expires_in;
		})
		.catch((error) => cl.console.error(error));

	clearTimeout(client_credentials_grant.interval);
	client_credentials_grant.interval = setTimeout(function () {
		client_credentials_grant();
	}, expires_in);
	return access_token;
}

function replaceToValidName(sentence) {
	return sentence.replace(/[^A-Z0-9]/gi, "_");
}
