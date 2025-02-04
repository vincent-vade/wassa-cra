import Link from "next/link";
import { type Project, client } from "~/lib/client";

export default function Projects({ projects }: { projects: Project[] }) {
	return (
		<>
			<h1>Projects</h1>
			{projects?.map((project) => (
				<li key={project?.id}>
					<Link href={`/projects/${project?.id}`}>{project?.name}</Link>
				</li>
			))}
		</>
	);
}

export async function getServerSideProps() {
	const fetchProjects = async () => {
		const { data } = await client.GET("/api/rest/projects");
		return data?.projects as Project[];
	};

	return {
		props: {
			projects: await fetchProjects(),
		},
	};
}
