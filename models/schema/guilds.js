const { Schema, model } = require("mongoose");

module.exports = User = model(
	"Guild",
	new Schema(
		{
			id: {
				type: String,
				required: true,
			},
			prefix: {
				type: String,
				required: false,
			},
		},
		{ timestamps: true },
	),
);
