import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import * as metadata from "@metaplex-foundation/mpl-token-metadata";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { render } from "react-dom";
import { useEffect, useState } from "react";
import { ConnectionContext, WalletContext } from "@solana/wallet-adapter-react";

export const getCustomToken = async (connection) => {
	var from = new web3.PublicKey('9EXvDdRhcHcSY4srb4tPw4PSprJg223HutTakwECJv6S');

	const nftsmetadata = await metadata.Metadata.findDataByOwner(connection, from);
	console.log(nftsmetadata);
	return nftsmetadata;
};

export const NFTCard = (data) => {
	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardMedia
				component="img"
				height="140"
				image={data.image}
				alt="green iguana"
			/>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div">
					{data.name}
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

export function ListNFTs(props) {
	const { wallets, endpoint } = props;
	const [metadatas, setMetadatas] = useState([]);
	useEffect(() => {
		getCustomToken(wallets?.publicKey.toBase58(), endpoint?.connection).then(
			(data) => setMetadatas(data)
		);
	}, [wallets, endpoint]);
	console.log(wallets, endpoint);
	return metadatas.map((metadata, index) => {
		return <NFTCard data={metadata} id={index} />;
	});
}
