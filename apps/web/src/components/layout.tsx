import { AppShell, Box, Button, Group, NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";

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
				<Group
					mih={50}
					gap="lg"
					justify="space-between"
					align="center"
					wrap="nowrap"
					p="xs"
				>
					<div>logo</div>

					<Box>
						{auth?.user?.email}
						<Button
							type="button"
							onClick={() => auth?.logout()}
							variant="transparent"
						>
							Logout
						</Button>
					</Box>
				</Group>
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
