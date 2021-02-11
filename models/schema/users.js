import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
	"User",
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
