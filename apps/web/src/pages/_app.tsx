import "~/styles/globals.css";
import type { AppProps } from "next/app";

import { AuthProvider } from "~/context/AuthContext";
import { ToasterProvider } from "~/context/ToastContext";

import Toaster from "~/components/Toaster";

import "@mantine/core/styles.css";

// import "../styles/table.css";

import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
	/** Put your mantine theme override here */
});

export default function App({ Component, pageProps }: AppProps) {
	return (
    <ToasterProvider>
			<MantineProvider theme={theme}>
				<AuthProvider>
					<Component {...pageProps} />
					<Toaster />
				</AuthProvider>
			</MantineProvider>
      </ToasterProvider>
	);
}
