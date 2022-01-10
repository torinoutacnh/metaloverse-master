import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

// token publickey
const mintAddress = new web3.PublicKey(process.env.REACT_APP_MINTER_ADDRESS);
const createToken = (connection, from) => {
	return new splToken.Token(
		connection,
		mintAddress,
		splToken.TOKEN_PROGRAM_ID,
		from
	);
};

export const transferSolInstruction = async (
	wallets,
	toAddress = [],
	amount
) => {
	var instructions = new web3.Transaction();
	toAddress.forEach((address) => {
		var to = new web3.PublicKey(address);
		var from = wallets.publicKey;
		instructions.add(
			web3.SystemProgram.transfer({
				fromPubkey: from,
				toPubkey: to,
				lamports: web3.LAMPORTS_PER_SOL * amount, // 1 Sol
			})
		);
	});
	return instructions;
};

export const checkAssociatedAccount = async (
	customToken,
	connection,
	to = web3.PublicKey
) => {
	var toTokenAccount = await splToken.Token.getAssociatedTokenAddress(
		customToken.associatedProgramId,
		customToken.programId,
		customToken.publicKey,
		to
	);

	const receiverAccount = await connection.getAccountInfo(toTokenAccount);

	if (receiverAccount === null) return null;
	return toTokenAccount;
};

export const transferToken = async (
	wallets,
	connection,
	toAddress = [],
	amount
) => {
	var instructions = [];
	var customToken = createToken(connection, wallets.publicKey);
	var fromTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
		wallets.publicKey
	);
	// Construct my token class
	toAddress.forEach((address) => {
		instructions.push(
			splToken.Token.createTransferInstruction(
				splToken.TOKEN_PROGRAM_ID,
				fromTokenAccount.address,
				address,
				wallets.publicKey,
				[],
				web3.LAMPORTS_PER_SOL * amount
			)
		);
	});
	return instructions;
};

export const transferTokenInstruction = async (
	connection,
	wallets,
	toAddresses = [],
	amount
) => {
	var instructions = new web3.Transaction();
	var from = wallets.publicKey;
	// Construct my token class
	var customToken = new splToken.Token(
		connection,
		mintAddress,
		splToken.TOKEN_PROGRAM_ID,
		from
	);

	var accounts = [];
	toAddresses.forEach(async (toAddress) => {
		var to = new web3.PublicKey(toAddress);
		var account = await checkAssociatedAccount(customToken, connection, to);
		if (account === null) {
			instructions.add(
				splToken.Token.createAssociatedTokenAccountInstruction(
					customToken.associatedProgramId,
					customToken.programId,
					mintAddress,
					account,
					to,
					from
				)
			);
		}
		accounts.push(account);
	});

	var transaction = await transferToken(wallets, connection, accounts, amount);

	instructions.add(...transaction);
	return instructions;
};

export const usdToTokenInstruction = async (amount, wallets, connection) => {};

export const makeTransaction = async (wallets, connection, instructions) => {
	try {
		const transaction = new web3.Transaction().add(...instructions);

		// Setting the variables for the transaction
		transaction.feePayer = await wallets.publicKey;
		let blockhashObj = await connection.getRecentBlockhash();
		transaction.recentBlockhash = await blockhashObj.blockhash;
		// Transaction constructor initialized successfully
		if (transaction) {
			console.log("Txn created successfully");
		}
		// Request creator to sign the transaction (allow the transaction)
		let signed = await wallets.signTransaction(transaction);
		// The signature is generated
		let signature = await connection.sendRawTransaction(signed.serialize());
		// Confirm whether the transaction went through or not
		await connection.confirmTransaction(signature);

		//Signature chhap diya idhar
		console.log("Signature: ", signature);
	} catch (error) {
		console.log(error);
	}
};

export const getToken = async (address, connection) => {
	try {
		var from = web3.PublicKey(address);
		// Construct my token class
		var customToken = new splToken.Token(
			connection,
			mintAddress,
			splToken.TOKEN_PROGRAM_ID,
			from
		);
		// // Create associated token accounts for my token if they don't exist yet
		var fromTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
			from
		);

		const myWalletMyTokenBalance = await connection.getTokenAccountBalance(
			fromTokenAccount.address
		);
		console.log("myWalletMyTokenBalance : ", myWalletMyTokenBalance);
		return myWalletMyTokenBalance;
	} catch (error) {
		console.log(error);
	}
};
