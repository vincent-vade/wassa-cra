import "~/styles/globals.css";
import type { AppProps } from "next/app";

import { AuthProvider } from "~/context/AuthContext";

import "../styles/table.css";
import Toaster from "~/components/Toaster";
import { ToasterProvider } from "~/context/ToastContext";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<ToasterProvider>
				<Component {...pageProps} />
				<Toaster />
			</ToasterProvider>
		</AuthProvider>
	);
}
