import mongoose from 'mongoose';

const { Schema } = mongoose;

const collection = 'categories';

const userSchema = new Schema(
	{
		slug: { type: String, required: true },
		name: { type: String, required: true },
		url: { type: String, unique: true, required: true },
	},
	{
		timestamps: true,
		strict: true,
	}
);

export const CategoryModel = mongoose.model(collection, userSchema);
