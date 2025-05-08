import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const { Schema } = mongoose;

const collection = 'tickets';

// code generator
const generateUniqueCode = customAlphabet(
	'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%^&',
	12
);

const ticketSchema = new Schema(
	{
		code: {
			type: String,
			unique: true,
			default: () => generateUniqueCode(), //automatically generated
		},
		amount: {
			type: Number,
			required: true,
		},
		purchaser: {
			type: String,
			required: true, // purchaser email
			lowercase: true,
		},
		products: {
			type: [
				{
					product: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'products',
						required: true,
					},
					quantity: {
						type: Number,
						required: true,
						min: 1,
					},
					subtotal: {
						type: Number,
						required: true,
					},
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
		strict: true,
	}
);

export const TicketModel = mongoose.model(collection, ticketSchema);
