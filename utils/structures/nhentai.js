import NanaAPI from "nana-api";
import _ from "lodash";

const api = new NanaAPI();

export default class NHentai {
	constructor(client) {
		this.client = client;
	}

	async printBook(message, book) {
		let gallery;
		try {
			gallery = await api.g(book);
		} catch (error) {
			console.error(error);
		}

		const tags = {
			language: "\u200B",
			artist: [],
			group: [],
			categories: [],
			parodies: [],
			characters: [],
			tags: [],
		};
		gallery.tags.map((tag) => {
			switch (tag.type) {
				case "language":
					if (
						gallery.tags
							.map((t) => t.name)
							.includes("translated") &&
						tag.name !== "translated"
					)
						tags.language = `${_.startCase(tag.name)} (Translated)`;
					else if (tags.language === "\u200B")
						tags.language = _.startCase(tag.name);
					break;

				case "artist":
					tags.artist.push(_.startCase(tag.name));
					break;

				case "parody":
					tags.parodies.push(_.startCase(tag.name));
					break;

				case "character":
					tags.characters.push(_.startCase(tag.name));
					break;

				case "category":
					tags.categories.push(_.startCase(tag.name));
					break;

				case "group":
					tags.group.push(_.startCase(tag.name));
					break;

				default:
					tags.tags.push(_.startCase(tag.name));
					break;
			}
		});
		const embed = {
			author: {
				name: gallery.title.pretty,
				url: `https://nhentai.net/g/${gallery.id}`,
				icon_url: "https://i.imgur.com/uLAimaY.png",
			},
			fields: [
				{
					name: "Artist",
					value: tags.artist.length ? tags.artist : "N/A",
					inline: true,
				},
				{
					name: "Group",
					value: tags.group.length ? tags.group.join(", ") : "\u200B",
					inline: true,
				},
				{
					name: "Parodies",
					value: tags.parodies.length
						? tags.parodies.join(", ")
						: "\u200B",
					inline: true,
				},
				{
					name: "Characters",
					value: tags.characters.length
						? tags.characters.join(", ")
						: "\u200B",
					inline: true,
				},
				{
					name: "Language",
					value: tags.language,
					inline: true,
				},
				{
					name: "Categories",
					value: tags.categories.length
						? tags.categories.join(", ")
						: "\u200B",
					inline: true,
				},
				{
					name: "Pages",
					value: gallery.num_pages,
					inline: true,
				},
				{
					name: "Tags",
					value: tags.tags.length ? tags.tags.join(", ") : "\u200B",
				},
			],
			image: {
				url: `https://i.nhentai.net/galleries/${gallery.media_id}/1.jpg`,
			},
		};

		return message.channel.send({ embed: embed });
	}
}
