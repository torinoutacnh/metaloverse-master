import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

// token publickey
const mintAddress = new web3.PublicKey(process.env.REACT_APP_MINTER_ADDRESS);
// system seed
const secrectKey = process.env.REACT_APP_SYSTEM_KEYPAIR.split(",");
// system keypair
export const systemAddress = web3.Keypair.fromSecretKey(
	Uint8Array.from(secrectKey)
);
console.log(systemAddress.publicKey.toBase58(), systemAddress);
// create custom token
export const createToken = (connection, from) => {
	return new splToken.Token(
		connection,
		mintAddress,
		splToken.TOKEN_PROGRAM_ID,
		from
	);
};
// transfer sol instrucction
const solInstruction = (from, to, amount) => {
	var instruction = web3.SystemProgram.transfer({
		fromPubkey: from,
		toPubkey: to,
		lamports: web3.LAMPORTS_PER_SOL * amount, // 1 Sol
	});
	return instruction;
};
// transfer sol
export const transferSolInstruction = async (
	wallets,
	toAddress = [],
	amount
) => {
	var instructionsSol = [];
	toAddress.forEach((items) => {
		var to = new web3.PublicKey(items.trim());
		instructionsSol.push(solInstruction(wallets.publicKey, to, amount));
	});
	return instructionsSol;
};
// transfer token instrucction
export const tokenInstruction = (
	fromTokenAccount,
	toTokenAccounts = [],
	from,
	amount
) => {
	const instructions = [];
	// const instructions = new web3.Transaction();
	toTokenAccounts.forEach((toTokenAccount) => {
		instructions.push(
			splToken.Token.createTransferInstruction(
				splToken.TOKEN_PROGRAM_ID,
				fromTokenAccount.address,
				toTokenAccount,
				from,
				[],
				web3.LAMPORTS_PER_SOL * amount
			)
		);
	});
	return instructions;
};
// transfer nft instrucction
export const nftInstruction = (
	fromTokenAccount,
	toTokenAccounts = [],
	from
) => {
	const instructions = [];
	// const instructions = new web3.Transaction();
	toTokenAccounts.forEach((toTokenAccount) => {
		instructions.push(
			splToken.Token.createTransferInstruction(
				splToken.TOKEN_PROGRAM_ID,
				fromTokenAccount.address,
				toTokenAccount,
				from,
				[],
				new splToken.u64()
			)
		);
	});
	return instructions;
};
// transfer token
export const transferTokenInstruction = async (
	wallets,
	connection,
	toAddress = [],
	amount
) => {
	var instructions = [];
	var from = wallets.publicKey;
	// Construct my token class
	var customToken = new splToken.Token(
		connection,
		mintAddress,
		splToken.TOKEN_PROGRAM_ID,
		from
	);
	// Create associated token accounts for my token if they don't exist yet
	var fromTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
		from
	);
	var toTokenAccounts = [];
	for (var address of toAddress) {
		var to = new web3.PublicKey(address);
		var toTokenAccount = await splToken.Token.getAssociatedTokenAddress(
			customToken.associatedProgramId,
			customToken.programId,
			customToken.publicKey,
			to
		);
		const receiverAccount = await connection.getAccountInfo(toTokenAccount);
		if (receiverAccount === null) {
			instructions.push(
				splToken.Token.createAssociatedTokenAccountInstruction(
					customToken.associatedProgramId,
					customToken.programId,
					mintAddress,
					toTokenAccount,
					to,
					from
				)
			);
		}
		toTokenAccounts.push(toTokenAccount);
	}

	var tokeninstruction = tokenInstruction(
		fromTokenAccount,
		toTokenAccounts,
		from,
		amount
	);
	instructions.push(...tokeninstruction);
	return instructions;
};
// swap sol token
export const tokenSwap = async (
	connection,
	wallets,
	solAmount,
	tokenAmount
) => {
	var tranSol = await transferSolInstruction(
		wallets,
		[systemAddress.publicKey.toBase58()],
		solAmount
	);

	var instructions = [];
	var from = systemAddress.publicKey;
	// Construct my token class
	var customToken = new splToken.Token(
		connection,
		mintAddress,
		splToken.TOKEN_PROGRAM_ID,
		from
	);
	// Create associated token accounts for my token if they don't exist yet
	var fromTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
		from
	);

	var to = wallets.publicKey;
	var toTokenAccount = await splToken.Token.getAssociatedTokenAddress(
		customToken.associatedProgramId,
		customToken.programId,
		customToken.publicKey,
		to
	);
	const receiverAccount = await connection.getAccountInfo(toTokenAccount);
	if (receiverAccount === null) {
		instructions.add(
			splToken.Token.createAssociatedTokenAccountInstruction(
				customToken.associatedProgramId,
				customToken.programId,
				mintAddress,
				toTokenAccount,
				to,
				systemAddress.publicKey
			)
		);
	}

	var tokeninstruction = splToken.Token.createTransferInstruction(
		splToken.TOKEN_PROGRAM_ID,
		fromTokenAccount.address,
		toTokenAccount,
		systemAddress.publicKey,
		[],
		web3.LAMPORTS_PER_SOL * tokenAmount
	);
	instructions.push(tokeninstruction);
	instructions.push(...tranSol);
	return instructions;
};
// create and sign transaction
export const makeTransaction = async (
	wallets,
	connection,
	instructions,
	isPartialSign = false
) => {
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
		if (isPartialSign) {
			transaction.partialSign(...[systemAddress]);
		}
		let signature = await connection.sendRawTransaction(signed.serialize());
		// Confirm whether the transaction went through or not
		await connection.confirmTransaction(signature);

		//Signature chhap diya idhar
		console.log("Signature: ", signature);
	} catch (error) {
		console.log(error);
	}
};

export const getSolBookToken = async (address, connection) => {
	try {
		var from = new web3.PublicKey(address);
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

export const calculaltePrice = () => {};

export const getSolanaPrice = async () => {
	const response = await fetch(
		`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`,
		{
			method: "GET",
		}
	);

	const data = await response.json();
	return data.solana.usd;
};

//transfer nft
export const transferNFTInstruction = async (
	wallets,
	connection,
	toAddress = []
) => {
	var instructions = [];
	var from = wallets.publicKey;
	var mint = new web3.PublicKey("FaQ9q3S6gvmYsSXxuiWxQKvYNvMukqULbnHcas2qE8Ej");
	// Construct my token class
	var customToken = new splToken.Token(
		connection,
		mint,
		splToken.TOKEN_PROGRAM_ID,
		from
	);
	// Create associated token accounts for my token if they don't exist yet
	var fromTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
		from
	);
	var toTokenAccounts = [];
	for (var address of toAddress) {
		var to = new web3.PublicKey(address);
		var toTokenAccount = await splToken.Token.getAssociatedTokenAddress(
			customToken.associatedProgramId,
			customToken.programId,
			customToken.publicKey,
			to
		);
		const receiverAccount = await connection.getAccountInfo(toTokenAccount);
		if (receiverAccount === null) {
			instructions.push(
				splToken.Token.createAssociatedTokenAccountInstruction(
					customToken.associatedProgramId,
					customToken.programId,
					mint,
					toTokenAccount,
					to,
					from
				)
			);
		}
		toTokenAccounts.push(toTokenAccount);
	}

	var tokeninstruction = nftInstruction(fromTokenAccount, toTokenAccounts, from);
	instructions.push(...tokeninstruction);
	return instructions;
};
