import { type Freelance, client } from "~/lib/client";

export default function FreelancePage({ freelance }: { freelance: Freelance }) {
	return (
		<div>
			<h1>{freelance?.email}</h1>
			<p>{freelance?.daily_rate}</p>
		</div>
	);
}

export async function getServerSideProps({
	params,
}: { params: { id: string } }) {
	const fetchFreelance = async (id: string) => {
		const { data } = await client.GET("/api/rest/freelances/{id}", {
			params: {
				path: {
					id,
				},
			},
		});
		return data?.freelances_by_pk;
	};

	return {
		props: {
			freelance: await fetchFreelance(params.id),
		},
	};
}
