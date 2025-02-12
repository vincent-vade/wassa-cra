import Link from "next/link";
import type { PropsWithChildren } from "react";

import { useAuth } from "~/context/AuthContext";
import { useToaster } from "~/context/ToastContext";

export const Layout = ({ children }: PropsWithChildren) => {
	const auth = useAuth();
	const { addToast } = useToaster();

	return (
		<div className="flex">
			<aside className="h-screen top-0 sticky bg-gray-200 min-w-[200px] py-4 px-2">
				<nav>
					<ul>
						<li>
							<Link href="/dashboard/projects">Projects</Link>
						</li>
						<li>
							<Link href="/dashboard/clients">Clients</Link>
						</li>
						<li>
							<Link href="/dashboard/freelances">Freelances</Link>
						</li>
						<li>
							<Link href="/dashboard/timesheets">Timesheets</Link>
						</li>
					</ul>
				</nav>
			</aside>
			<main className="w-full">
				<nav>
					<button type="button" onClick={() => auth?.logout()}>
						Logout
					</button>
					<button type="button" onClick={() => addToast("Success", "success")}>
						Success
					</button>
				</nav>
				<div className="p-4">{children}</div>
			</main>
		</div>
	);
};
