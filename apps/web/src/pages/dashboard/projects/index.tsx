import dayjs from "dayjs";
import Link from "next/link";
import { Layout } from "~/components/layout";
import type { Project } from "~/lib/client";
import { getProjects } from "~/services/projects";

export default function Projects({ projects }: { projects: Project[] }) {
	return (
		<Layout>
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
							<td>{dayjs(project.created_at).format("DD-MM-YYYY")}</td>
							<td>
								{project.updated_at &&
									dayjs(project.updated_at).format("DD-MM-YYYY")}
							</td>
							<td>{project?.is_active}</td>
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
			projects: await getProjects(),
		},
	};
}
