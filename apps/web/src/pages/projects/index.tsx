import Link from "next/link";
import { type Project } from "~/lib/client";
import { getProjects } from "~/services/projects";
import dayjs from "dayjs";
import {useAuth} from "~/context/AuthContext";

export default function Projects({ projects }: { projects: Project[] }) {
	const { user } = useAuth();
	console.log(user);

	return (
		<>
			<h1>Projects</h1>
			<table>
				<thead>
					<tr>
						<th width={"260px"}>ID</th>
						<th>Project name</th>
						<th>Created at</th>
						<th>Updated at</th>
						<th>Is active</th>
					</tr>
				</thead>
				<tbody>
					{projects?.map((project) => (
						<tr key={project?.id}>
							<td>
								<Link href={`/projects/${project?.id}`}>{project?.id}</Link>
							</td>
							<td>{project?.name}</td>
							<td>{dayjs(project.created_at).format('DD-MM-YYYY')}</td>
							<td>{project.updated_at && dayjs(project.updated_at).format('DD-MM-YYYY')}</td>
							<td>{project?.is_active}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

export async function getServerSideProps(ctx) {
	return {
		props: {
			projects: await getProjects(),
		},
	};
}
