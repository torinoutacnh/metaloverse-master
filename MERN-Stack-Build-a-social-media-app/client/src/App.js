import { useMemo, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import PageRender, { PageRender2 } from "./customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

import Alert from "./components/alert/Alert";
import Header from "./components/header/Header";
import StatusModal from "./components/StatusModal";

import { useSelector, useDispatch } from "react-redux";
import { refreshToken } from "./redux/actions/authAction";
import { getPosts } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionsAction";

import io from "socket.io-client";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import SocketClient from "./SocketClient";

import { getNotifies } from "./redux/actions/notifyAction";
import CallModal from "./components/message/CallModal";
import Peer from "peerjs";

import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
	LedgerWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
	SolletExtensionWalletAdapter,
	SolletWalletAdapter,
	TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
	WalletModalProvider,
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import authReducer from "./redux/reducers/authReducer";
import { profile } from "console";
import Discover from "./pages/discover";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function App() {
	const { auth, status, modal, call } = useSelector((state) => state);
	const dispatch = useDispatch();
	const s = {
		token:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDk4NTdlZTNmZGI2NTg1ODA4ZDM5OCIsImlhdCI6MTY0MjY3MzA0MywiZXhwIjoxNjQyNzU5NDQzfQ.f_BCmp5CnPxz1C8DNQJEJO8xsnQDrUop0dq5aw2iU7c",
		user: {
			avatar:
				"https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
			role: "user",
			gender: "male",
			mobile: "",
			address: "",
			story: "",
			website: "",
			followers: [
				{
					avatar:
						"https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
					followers: ["61d884c5a606e88b042b0f16"],
					following: [
						"61d884c5a606e88b042b0f16",
						"61d7cc655bee4e5c6cc81af3",
						"61d9857ee3fdb6585808d398",
						"61d7c457817bef4194701ca2",
					],
					_id: "61d9882ae3fdb6585808d39a",
					fullname: "this is test",
					username: "test001",
				},
				{
					avatar:
						"https://res.cloudinary.com/design123/image/upload/s--ov9xsVOY--/v1641617812/gtk2gzlejlqrgprp5dlw.jpg",
					followers: ["61d9882ae3fdb6585808d39a", "61d7c457817bef4194701ca2"],
					following: [
						"61d7cc655bee4e5c6cc81af3",
						"61d9882ae3fdb6585808d39a",
						"61d9857ee3fdb6585808d398",
						"61d7c457817bef4194701ca2",
					],
					_id: "61d884c5a606e88b042b0f16",
					fullname: "TRUONG LONG",
					username: "hellocoba",
				},
				{
					avatar:
						"https://res.cloudinary.com/design123/image/upload/s--H-2b2g9g--/v1642666715/cztf6vmfonswfpt6impq.png",
					followers: [
						"61d9882ae3fdb6585808d39a",
						"61d884c5a606e88b042b0f16",
						"61d9857ee3fdb6585808d398",
					],
					following: [
						"61d7cc655bee4e5c6cc81af3",
						"61d884c5a606e88b042b0f16",
						"61d9857ee3fdb6585808d398",
					],
					_id: "61d7c457817bef4194701ca2",
					fullname: "Trần Ngọc Đạt",
					username: "dattran2012",
				},
			],
			following: [
				{
					avatar:
						"https://res.cloudinary.com/design123/image/upload/s--H-2b2g9g--/v1642666715/cztf6vmfonswfpt6impq.png",
					followers: [
						"61d9882ae3fdb6585808d39a",
						"61d884c5a606e88b042b0f16",
						"61d9857ee3fdb6585808d398",
					],
					following: [
						"61d7cc655bee4e5c6cc81af3",
						"61d884c5a606e88b042b0f16",
						"61d9857ee3fdb6585808d398",
					],
					_id: "61d7c457817bef4194701ca2",
					fullname: "Trần Ngọc Đạt",
					username: "dattran2012",
				},
			],
			saved: [],
			_id: "61d9857ee3fdb6585808d398",
			fullname: "hmc",
			username: "hmc",
			email: "custardbruleic@gmail.com",
			password: "",
			createdAt: "2022-01-08T12:37:18.408Z",
			updatedAt: "2022-01-20T09:43:07.696Z",
			__v: 0,
		},
	};
	useEffect(() => {
		dispatch(refreshToken());

		const socket = io("https://socket.solbook.io");
		dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
		return () => socket.close();
	}, [dispatch]);

	useEffect(() => {
		if (auth.token) {
			dispatch(getPosts(auth.token));
			dispatch(getSuggestions(auth.token));
			dispatch(getNotifies(auth.token));
		}
	}, [dispatch, auth.token]);

	useEffect(() => {
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
		} else if (Notification.permission === "granted") {
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission().then(function (permission) {
				if (permission === "granted") {
				}
			});
		}
	}, []);

	useEffect(() => {
		const newPeer = new Peer(undefined, {
			path: "/",
			secure: true,
		});

		dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
	}, [dispatch]);

	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint.
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	// @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
	// Only the wallets you configure here will be compiled into your application, and only the dependencies
	// of wallets that your users connect to will be loaded.
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SlopeWalletAdapter(),
			new SolflareWalletAdapter(),
			new TorusWalletAdapter(),
			new LedgerWalletAdapter(),
			new SolletWalletAdapter({ network }),
			new SolletExtensionWalletAdapter({ network }),
		],
		[network]
	);

	return (
		<Router>
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>
						<WalletMultiButton />
						<WalletDisconnectButton />
						<Alert />
						<input type="checkbox" id="theme" />
						<div className={`App ${(status || modal) && "mode"}`}>
							<div className="main">
								{auth.token && <Header />}
								{status && <StatusModal />}
								{auth.token && <SocketClient />}
								{call && <CallModal />}
								<Route exact path="/" component={auth.token ? Home : Login} />
								<Route exact path="/register" component={Register} />

								<PrivateRouter exact path="/:page" component={PageRender} />
								<PrivateRouter exact path="/:page/:id" component={PageRender} />
							</div>
						</div>
					</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</Router>
	);
}

export default App;
