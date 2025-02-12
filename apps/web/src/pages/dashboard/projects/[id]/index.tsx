import { type Project, client } from "~/lib/client";

export default function ProjectPage({ project }: { project: Project }) {
	return (
		<>
			<h1>{project?.name}</h1>
			cras:
			{/*<ul>*/}
			{/*  {project?.cras?.map((cra) => (*/}
			{/*    <li key={cra.id}>{cra.number}</li>*/}
			{/*  ))}*/}
			{/*</ul>*/}
		</>
	);
}

export async function getServerSideProps({
	params,
}: { params: { id: string } }) {
	const fetchProject = async (id: string) => {
		const { data } = await client.GET("/api/rest/projects/{id}", {
			params: {
				path: {
					id,
				},
				params: {},
			},
		});
		return data?.projects_by_pk;
	};

	return {
		props: {
			project: await fetchProject(params.id),
		},
	};
}
