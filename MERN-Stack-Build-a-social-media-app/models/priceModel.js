const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
	{
		price: {
			type: Number,
			required: true,
		},
		SolOnToken: {
			type: Number,
			required: true,
		},
		USDOnToken: {
			type: Number,
			required: true,
		},
		SolPrice: {
			type: Number,
			required: true,
		},
		TotalToken: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("price", priceSchema);
