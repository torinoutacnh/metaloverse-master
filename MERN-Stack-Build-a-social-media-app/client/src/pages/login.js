import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { ConnectionContext, WalletContext } from "@solana/wallet-adapter-react";
import {
	transferSolInstruction,
	transferTokenInstruction,
	makeTransaction,
	tokenSwap,
	getSolanaPrice,
} from "../utils/instruction";
import { transferTokenInstruction2 } from "../utils/systemSend";
import axios from "axios";
import { io } from "socket.io-client";

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

	const createTestTransSol = async (
		wallets,
		connection,
		toAddress = [],
		amount
	) => {
		try {
			var instructions = [];
			var tranSol = await transferSolInstruction(wallets, toAddress, amount);
			instructions.push(...tranSol);

			await makeTransaction(wallets, connection, instructions);
		} catch (error) {
			console.log(error);
		}
	};

	const getPrice = async (token) => {
		const res = await axios.get(`http://localhost:5000/api/price`, {
			//headers: { Authorization: token },
		});
		var socket = io("http://localhost:5000");
		socket.emit("setPrice", res.data);
		//return res;
	};
	const setPrice = async (post, token) => {
		const res = await axios.post(`http://localhost:5000/api/setprice`, post, {
			//headers: { Authorization: token },
		});
		return res;
	};

	const createTestTransToken = async (
		wallets,
		connection,
		toAddress = [],
		amount
	) => {
		try {
			var instructions = await transferTokenInstruction(
				wallets,
				connection,
				toAddress,
				amount
			);
			await makeTransaction(wallets, connection, instructions);
		} catch (error) {
			console.log(error);
		}
	};

	const swap = async (connection, wallets, solAmount, tokenAmount) => {
		try {
			var instructions = await tokenSwap(
				connection,
				wallets,
				solAmount,
				tokenAmount
			);
			await makeTransaction(wallets, connection, instructions);
		} catch (error) {
			console.log(error);
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
									createTestTransSol(
										wallets,
										endpoint.connection,
										[
											"6zzUK8fxZ7vy2DWLJWGSUwvnUpq9q3rfDczP7PRDAzFi",
											"J2bq4sUo3Jsaq3XrvoTpNz8ryLoDPu3iPtKNWeH2s1Kc",
											"9LM4rELc4LmqEHsQAHwjP1oe14Y3dUpaRaWZmGX2noU5",
										],
										0.1
									)
								}
							>
								test trans sol
							</button>
							<button
								onClick={() =>
									createTestTransToken(
										wallets,
										endpoint.connection,
										[
											"qu5WPzNRQKBNN1Dp7Dwmuv8TssmS8C4Bpdq5RKe4dCf",
											"J2bq4sUo3Jsaq3XrvoTpNz8ryLoDPu3iPtKNWeH2s1Kc",
											"9LM4rELc4LmqEHsQAHwjP1oe14Y3dUpaRaWZmGX2noU5",
										],
										0.1
									)
								}
							>
								test trans token
							</button>
							<button onClick={() => swap(endpoint.connection, wallets, 0.1, 0.1)}>
								Swap
							</button>
							<button onClick={() => transferTokenInstruction2(endpoint.connection)}>
								trans2
							</button>
							<button onClick={() => getPrice()}>getPrice</button>
							<button
								onClick={() =>
									setPrice({
										sendtoken: 50,
									})
								}
							>
								setPrice
							</button>
							<button onClick={async () => console.log(await getSolanaPrice())}>
								get sol price
							</button>
						</div>
					)}
				</WalletContext.Consumer>
			)}
		</ConnectionContext.Consumer>
	);
};

export default Login;
