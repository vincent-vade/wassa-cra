import "~/styles/globals.css";
import type { AppProps } from "next/app";

import { AuthProvider } from "~/context/AuthContext";
import { ToasterProvider } from "~/context/ToastContext";

import Toaster from "~/components/Toaster";

import "../styles/table.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ToasterProvider>
			<AuthProvider>
				<Component {...pageProps} />
				<Toaster />
			</AuthProvider>
		</ToasterProvider>
	);
}
