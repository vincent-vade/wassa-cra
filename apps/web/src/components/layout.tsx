import { AppShell, Flex, List, NavLink } from "@mantine/core";
import Link from "next/link";
import type { PropsWithChildren } from "react";

import { useRouter } from "next/router";
import { useAuth } from "~/context/AuthContext";

const navLinks = [
	{ label: "Projects", href: "/admin/projects" },
	{ label: "Clients", href: "/admin/clients" },
	{ label: "Freelances", href: "/admin/freelances" },
	{ label: "Timesheets", href: "/admin/timesheets" },
];

export const Layout = ({ children }: PropsWithChildren) => {
	const auth = useAuth();
	const { pathname } = useRouter();

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
				<Flex
					mih={50}
					gap="lg"
					justify="space-between"
					align="center"
					direction="row"
					wrap="nowrap"
					p="md"
				>
					<div>Logo</div>
					<button type="button" onClick={() => auth?.logout()}>
						Logout
					</button>
				</Flex>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				{navLinks.map((link) => (
					<NavLink
						key={link.href}
						component={Link}
						href={link.href}
						label={link.label}
						active={pathname === link.href}
					/>
				))}
			</AppShell.Navbar>

			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	);
};
