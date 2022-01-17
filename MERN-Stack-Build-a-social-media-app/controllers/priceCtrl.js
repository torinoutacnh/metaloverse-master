const Prices = require("../models/priceModel");
const { fetch } = require("cross-fetch");

const getSolanaPrice = async () => {
	const response = await fetch(
		`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`,
		{
			method: "GET",
		}
	);

	const data = await response.json();
	return data.solana.usd;
};
const priceCtrl = {
	getPrice: async (req, res) => {
		try {
			var price = await Prices.findOne()
				.sort({ createdAt: "asc", _id: 1 })
				.limit(1);

			res.json({ price });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	setPrice: async (req, res) => {
		try {
			const { sendtoken } = req.body;

			var latestprice = await Prices.findOne()
				.sort({ createdAt: "asc", _id: 1 })
				.limit(1);
			var solprice = await getSolanaPrice();
			var newprice = solprice / (latestprice.TotalToken - sendtoken);
			var newsol = latestprice.Sol + sendtoken * latestprice.price;
			var newtotaltoken = latestprice.TotalToken - sendtoken;
			const Price = new Prices({
				price: newprice,
				Sol: newsol,
				SolOnToken: newprice,
				USDOnToken: newprice * solprice,
				SolPrice: solprice,
				TotalToken: newtotaltoken,
			});
			await Price.save();
			res.json({ msg: "Success!" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
};

module.exports = priceCtrl;
