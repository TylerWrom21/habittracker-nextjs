import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: String, required: true, trim: true, maxlength: 60 },

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			index: true,
		},

		password: {
			type: String,
			required: true,
			minlength: 8,
		},

		settings: {
			timezone: { type: String, default: "UTC" },
			theme: {
				type: String,
				enum: ["light", "dark", "system"],
				default: "system",
			},
			dateFormat: { type: String, default: "YYYY-MM-DD" },
		},

	},
	{ versionKey: false, timestamps: true },
);

export default models.User || model("User", UserSchema);
