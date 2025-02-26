import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "~/styles/globals.css";

import {
	type MantineColorsTuple,
	MantineProvider,
	createTheme,
} from "@mantine/core";
import type { AppProps } from "next/app";

import { AuthProvider } from "~/context/AuthContext";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

const base: MantineColorsTuple = [
	"#f6eeff",
	"#e7d9f7",
	"#cab1ea",
	"#ad86dd",
	"#9462d2",
	"#854bcb",
	"#7d3fc9",
	"#6b31b2",
	"#5f2ba0",
	"#52238d",
];
const theme = createTheme({
	colors: {
		base,
	},
	primaryColor: "base",
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider theme={theme}>
			<AuthProvider>
				<ModalsProvider>
					<Component {...pageProps} />
				</ModalsProvider>
				<Notifications />
			</AuthProvider>
		</MantineProvider>
	);
}
