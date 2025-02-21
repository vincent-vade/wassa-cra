import Link from "next/link";
import type { PropsWithChildren } from "react";

import './layout.css'

import { useAuth } from "~/context/AuthContext";

export const Layout = ({ children }: PropsWithChildren) => {
	const auth = useAuth();

	return (
		<div className="flex">
			<aside>
				<nav>
					<ul>
						<li>
							<Link href="/admin">Dashboard</Link>
						</li>
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
						<hr style={{marginTop: '1rem', marginBottom: '1rem'}} />
						<li>
							<button type="button" onClick={() => auth?.logout()}>
								Logout
							</button>
						</li>
					</ul>
				</nav>
			</aside>
			<div className={'main'}>
				{children}
			</div>
		</div>
	);
};
