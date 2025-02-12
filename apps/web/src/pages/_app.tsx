import "~/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

import { Toaster } from "~/components/Toaster";

import "../styles/table.css";
import type { AppProps } from "next/app";

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<SessionProvider session={session}>
			<div className="flex">
				<aside className="h-screen top-0 sticky bg-gray-200 min-w-[200px] py-4 px-2">
					<nav>
						<ul>
							<li>
								<Link href="/projects">Projects</Link>
							</li>
							<li>
								<Link href="/clients">Clients</Link>
							</li>
							<li>
								<Link href="/freelances">Freelances</Link>
							</li>
							<li>
								<Link href="/timesheets">Timesheets</Link>
							</li>
						</ul>
					</nav>
				</aside>
				<main className="w-full">
					<div className="p-4">
						<Component {...pageProps} />
					</div>

					<Toaster />
				</main>
			</div>
		</SessionProvider>
	);
}
