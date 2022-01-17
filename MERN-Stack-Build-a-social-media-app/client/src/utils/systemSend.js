import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import * as nacl from "tweetnacl";

// token publickey
const mintAddress = new web3.PublicKey(process.env.REACT_APP_MINTER_ADDRESS);
// system seed
const secrectKey = process.env.REACT_APP_SYSTEM_KEYPAIR.split(",");
// system keypair
export const systemAddress = web3.Keypair.fromSecretKey(
	Uint8Array.from(secrectKey)
);

export const transferTokenInstruction2 = async (connection) => {
	var toPubkey = new web3.PublicKey(
		"6FVxrqH9FFtEFo643pYx8w5GqfYRS8uWA5hZMUn1VNFr"
	);
	// Alternatively, manually construct the transaction
	let recentBlockhash = await connection.getRecentBlockhash();

	let transaction = new web3.Transaction({
		recentBlockhash: recentBlockhash.blockhash,
		feePayer: toPubkey,
	});

	// Add an instruction to execute
	transaction.add(
		web3.SystemProgram.transfer({
			fromPubkey: systemAddress.publicKey,
			toPubkey: toPubkey,
			lamports: web3.LAMPORTS_PER_SOL * 1, // 1 Sol
		})
	);
	var airdrop = new web3.PublicKey(
		"9e6MJvE6UpEYZ5StfoHkL24Nui6jmi7QaGutc4yjGxKk"
	);
	let airdropSignature = await connection.requestAirdrop(
		airdrop,
		web3.LAMPORTS_PER_SOL * 2
	);

	await connection.confirmTransaction(airdropSignature);
	console.log("success");
	// await web3.sendAndConfirmTransaction(connection, transaction, [systemAddress]);

	// Construct my token class
	// var customToken = new splToken.Token(
	// 	connection,
	// 	mintAddress,
	// 	splToken.TOKEN_PROGRAM_ID,
	// 	toPubkey
	// );
	// var fromTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
	// 	systemAddress.publicKey
	// );
	// var toTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
	// 	toPubkey
	// );
	// transaction.add(
	// 	splToken.Token.createTransferInstruction(
	// 		splToken.TOKEN_PROGRAM_ID,
	// 		fromTokenAccount.address,
	// 		toTokenAccount,
	// 		toPubkey,
	// 		[],
	// 		web3.LAMPORTS_PER_SOL
	// 	)
	// );
	// console.log(transaction);
	// await web3.sendAndConfirmTransaction(connection, transaction, [systemAddress]);

	// let transactionBuffer = transaction.serializeMessage();
	// let signature = nacl.sign.detached(transactionBuffer, systemAddress.secretKey);

	// transaction.addSignature(systemAddress.publicKey, signature);

	// let isVerifiedSignature = transaction.verifySignatures();
	// console.log(`The signatures were verifed: ${isVerifiedSignature}`);

	// // The signatures were verified: true

	// let rawTransaction = transaction.serialize();

	// await web3.sendAndConfirmRawTransaction(connection, rawTransaction);
};
