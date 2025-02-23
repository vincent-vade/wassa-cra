import "@mantine/core/styles.css";
import "~/styles/globals.css";

import {
	type MantineColorsTuple,
	MantineProvider,
	createTheme,
} from "@mantine/core";
import type { AppProps } from "next/app";

import { AuthProvider } from "~/context/AuthContext";
import { ToasterProvider } from "~/context/ToastContext";

import Toaster from "~/components/Toaster";

const base: MantineColorsTuple = [
	"#eeedff",
	"#d9d7fc",
	"#afacf1",
	"#837ee6",
	"#5e57dd",
	"#463ed8",
	"#3932d7",
	"#2b25bf",
	"#2420ac",
	"#1a1a98",
];

const theme = createTheme({
	colors: {
		base,
	},
	primaryColor: "base",
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
