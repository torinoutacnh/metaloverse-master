import * as web3 from "@solana/web3.js";
import * as metadata from "@metaplex-foundation/mpl-token-metadata";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { ConnectionContext, WalletContext } from "@solana/wallet-adapter-react";

export const getCustomToken = async (connection) => {
	var from = new web3.PublicKey('9EXvDdRhcHcSY4srb4tPw4PSprJg223HutTakwECJv6S');
=======
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
>>>>>>> 91cf41b1840e26834f8db33906d6419ae7cbb7ee

export const getCustomToken = async (connection) => {
	var from = new web3.PublicKey("6FVxrqH9FFtEFo643pYx8w5GqfYRS8uWA5hZMUn1VNFr");
	const nftsmetadata = await metadata.Metadata.findDataByOwner(connection, from);
	return nftsmetadata;
};

export const NFTCard = (data) => {
	const [metadatadata, setMetadatadata] = useState({});
	useEffect(() => {
		axios.get(data.data.data.uri, {}).then((data) => setMetadatadata(data));
	}, []);
	//var meta = axios.get(data.data.data.uri, {});
	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardMedia
				component="img"
				height="140"
				image={metadatadata.data.image}
				alt={data.data.data.symbol}
			/>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div">
					{data.data.name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{data.description}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">Buy</Button>
			</CardActions>
		</Card>
	);
};

export function ListNFTs() {
	const connection = useConnection().connection;
	const wallets = useWallet();
	const [metadatas, setMetadatas] = useState([]);
	useEffect(() => {
		// getCustomToken(wallets?.publicKey.toBase58(), connection).then((data) =>
		// 	setMetadatas(data)
		// );
		getCustomToken(connection).then((data) => setMetadatas(data));
	}, [wallets, connection]);
	console.log(wallets, connection);
	return metadatas.map((data, index) => {
		return <NFTCard data={data} id={index} />;
	});
}
