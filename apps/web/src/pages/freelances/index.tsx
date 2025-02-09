import Link from "next/link";
import { type Freelance } from "~/lib/client";
import { getFreelances } from "~/services/freelances";
import dayjs from "dayjs";
import {useAuth} from "~/context/AuthContext";

export default function Freelances({
	freelances,
}: { freelances: Freelance[] }) {
	const { user } = useAuth();
	console.log(user);

	return (
		<>
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
							<td>{dayjs(freelance.created_at).format('DD-MM-YYYY')}</td>
							<td>{freelance.updated_at && dayjs(freelance.updated_at).format('DD-MM-YYYY')}</td>
						</tr>
					))}
				</tbody>
			</table>

		</>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			freelances: await getFreelances(),
		},
	};
}
