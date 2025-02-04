import "~/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
	return (
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
			<main className="px-8 w-full">
				<div className="pt-4">
					<Component {...pageProps} />
				</div>
			</main>
		</div>
	);
}
