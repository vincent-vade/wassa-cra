import dayjs from "dayjs";
import Link from "next/link";
import { Layout } from "~/components/layout";
import { useAuth } from "~/context/AuthContext";
import type { Freelance } from "~/lib/client";
import { getFreelances } from "~/services/freelances";

export default function Freelances({
	freelances,
}: { freelances: Freelance[] }) {
	const auth = useAuth();
	console.log(auth?.user);

	return (
		<Layout>
			<h1>Freelances</h1>
			<table>
				<thead>
					<tr>
						<th width={"260px"}>Id</th>
						<th>Email</th>
						<th>TJM</th>
						<th>Created At</th>
						<th>Updated At</th>
					</tr>
				</thead>
				<tbody>
					{freelances?.map((freelance) => (
						<tr key={freelance?.id}>
							<td>{freelance?.id}</td>
							<td>{freelance?.email}</td>
							<td>{freelance?.daily_rate}</td>
							<td>{dayjs(freelance.created_at).format("DD-MM-YYYY")}</td>
							<td>
								{freelance.updated_at &&
									dayjs(freelance.updated_at).format("DD-MM-YYYY")}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Layout>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			freelances: await getFreelances(),
		},
	};
}
