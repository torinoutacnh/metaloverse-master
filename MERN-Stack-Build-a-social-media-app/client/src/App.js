import { useMemo, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import PageRender from "./customRouter/PageRender";
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

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function App() {
	const { auth, status, modal, call } = useSelector((state) => state);
	const dispatch = useDispatch();

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
						{/* <WalletMultiButton />
						<WalletDisconnectButton /> */}
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
