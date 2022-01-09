import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { ConnectionContext, WalletContext } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

const Login = () => {
	const initialState = { email: "", password: "" };
	const [userData, setUserData] = useState(initialState);
	const { email, password } = userData;

	const [typePass, setTypePass] = useState(false);

	const { auth } = useSelector((state) => state);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		if (auth.token) history.push("/");
	}, [auth.token, history]);

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(login(userData));
	};

	const getProvider = async () => {
		if ("solana" in window) {
			const provider = window.solana;
			if (provider.isPhantom) {
				console.log("Is Phantom installed?  ", provider.isPhantom);
				return provider;
			}
		} else {
			window.open("https://www.phantom.app/", "_blank");
		}
	};

	const transferSol = async (wallets, connection, toAddress) => {
		if (wallets.connected) {
			try {
				var to = new web3.PublicKey(toAddress);
				var from = wallets.publicKey;
				//var from = web3.Keypair.fromSeed(seed);
				console.log(to, wallets, from);
				var transaction = new web3.Transaction().add(
					web3.SystemProgram.transfer({
						fromPubkey: from,
						toPubkey: to,
						lamports: web3.LAMPORTS_PER_SOL, // 1 Sol
					})
				);
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
		} else {
			//connect wallet action
		}
	};

	const getToken = async (wallets, connection) => {
		if (wallets.connected) {
			try {
				var from = wallets.publicKey;
				// // Construct my token class
				var myMint = new web3.PublicKey(
					"CnSfJEVhiysH7ZcB1AZ7ztUKmMxWvkAmGH1qn68Pq5NK"
				);
				var customToken = new splToken.Token(
					connection,
					myMint,
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
		}
	};

	const transferToken = async (wallets, connection, toAddress, amount) => {
		if (wallets.connected) {
			try {
				var from = wallets.publicKey;
				var to = new web3.PublicKey(toAddress);
				// token publickey
				var myMint = new web3.PublicKey(
					"CnSfJEVhiysH7ZcB1AZ7ztUKmMxWvkAmGH1qn68Pq5NK"
				);
				// Construct my token class
				var customToken = new splToken.Token(
					connection,
					myMint,
					splToken.TOKEN_PROGRAM_ID,
					from
				);
				// Create associated token accounts for my token if they don't exist yet
				var fromTokenAccount = await customToken.getOrCreateAssociatedAccountInfo(
					from
				);
				var toTokenAccount = await splToken.Token.getAssociatedTokenAddress(
					customToken.associatedProgramId,
					customToken.programId,
					customToken.publicKey,
					to
				);
				const receiverAccount = await connection.getAccountInfo(toTokenAccount);
				const instructions = [];
				if (receiverAccount === null) {
					instructions.push(
						splToken.Token.createAssociatedTokenAccountInstruction(
							customToken.associatedProgramId,
							customToken.programId,
							myMint,
							toTokenAccount,
							to,
							from
						)
					);
				}

				instructions.push(
					new web3.Transaction().add(
						splToken.Token.createTransferInstruction(
							splToken.TOKEN_PROGRAM_ID,
							fromTokenAccount.address,
							toTokenAccount,
							from,
							[],
							web3.LAMPORTS_PER_SOL * amount
						)
					)
				);

				var k = await splToken.Token.getAssociatedTokenAddress(
					customToken.associatedProgramId,
					customToken.programId,
					customToken.publicKey,
					new web3.PublicKey("4WLjp959NfWeAp3FGxddrc8q1zjRasx4TQt5ALTKVqyG")
				);
				instructions.push(
					new web3.Transaction().add(
						splToken.Token.createTransferInstruction(
							splToken.TOKEN_PROGRAM_ID,
							fromTokenAccount.address,
							k,
							from,
							[],
							web3.LAMPORTS_PER_SOL * amount
						)
					)
				);

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
		}
	};

	return (
		<ConnectionContext.Consumer>
			{(endpoint) => (
				<WalletContext.Consumer>
					{(wallets) => (
						<div className="auth_page">
							<form onSubmit={handleSubmit}>
								<h3 className="text-uppercase text-center mb-4">V-Network</h3>
								<div className="form-group">
									<label htmlFor="exampleInputEmail1">Email address</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										name="email"
										aria-describedby="emailHelp"
										onChange={handleChangeInput}
										value={email}
									/>

									<small id="emailHelp" className="form-text text-muted">
										We'll never share your email with anyone else.
									</small>
								</div>

								<div className="form-group">
									<label htmlFor="exampleInputPassword1">Password</label>

									<div className="pass">
										<input
											type={typePass ? "text" : "password"}
											className="form-control"
											id="exampleInputPassword1"
											onChange={handleChangeInput}
											value={password}
											name="password"
										/>

										<small onClick={() => setTypePass(!typePass)}>
											{typePass ? "Hide" : "Show"}
										</small>
									</div>
								</div>

								<button
									type="submit"
									className="btn btn-dark w-100"
									disabled={email && password ? false : true}
								>
									Login
								</button>

								<p className="my-2">
									You don't have an account?{" "}
									<Link to="/register" style={{ color: "crimson" }}>
										Register Now
									</Link>
								</p>
							</form>
							<button
								onClick={() =>
									transferSol(
										wallets,
										endpoint.connection,
										"6zzUK8fxZ7vy2DWLJWGSUwvnUpq9q3rfDczP7PRDAzFi"
									)
								}
							>
								Transaction
							</button>
							<button onClick={() => getProvider()}>Get provider</button>
							<button onClick={() => getToken(wallets, endpoint.connection)}>
								get custom token
							</button>
							<button
								onClick={() =>
									transferToken(
										wallets,
										endpoint.connection,
										"J2bq4sUo3Jsaq3XrvoTpNz8ryLoDPu3iPtKNWeH2s1Kc",
										1
									)
								}
							>
								Transfer token
							</button>
						</div>
					)}
				</WalletContext.Consumer>
			)}
		</ConnectionContext.Consumer>
	);
};

export default Login;
