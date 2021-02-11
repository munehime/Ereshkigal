import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
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
