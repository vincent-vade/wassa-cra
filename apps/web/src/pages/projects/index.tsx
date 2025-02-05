import Link from "next/link";
import { type Project } from "~/lib/client";
import { getProjects } from "~/services/projects";

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
	return {
		props: {
			projects: await getProjects(),
		},
	};
}
