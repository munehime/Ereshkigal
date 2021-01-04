export default class Uitls {
	constructor(client) {
		this.client = client;
	}

	getEmote(emoteName, guild) {
		let emote;

		if (guild)
			emote = guild.emojis.cache.find(
				(emoji) => emoji.name.toLowerCase() === emoteName.toLowerCase(),
			);

		if (!emote)
			emote = this.client.emojis.cache.find(
				(emoji) => emoji.name.toLowerCase() === emoteName.toLowerCase(),
			);

		return emote;
	}
}
