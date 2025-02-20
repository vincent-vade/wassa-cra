import { AppShell } from "@mantine/core";
import Link from "next/link";
import type { PropsWithChildren } from "react";

import './layout.css'

import { useAuth } from "~/context/AuthContext";

export const Layout = ({ children }: PropsWithChildren) => {
	const auth = useAuth();

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 250,
				breakpoint: "sm",
			}}
			padding="md"
		>
			<AppShell.Header>
				<div>Logo</div>
				<button type="button" onClick={() => auth?.logout()}>
					Logout
				</button>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<nav>
					<ul>
						<li>
							<Link href="/admin/projects">Projects</Link>
						</li>
						<li>
							<Link href="/admin/clients">Clients</Link>
						</li>
						<li>
							<Link href="/admin/freelances">Freelances</Link>
						</li>
						<li>
							<Link href="/admin/timesheets">Timesheets</Link>
						</li>
					</ul>
				</nav>
			</AppShell.Navbar>

			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	);
};
