import Link from "next/link";
import { type Freelance, client } from "~/lib/client";

export default function Freelances({
	freelances,
}: { freelances: Freelance[] }) {
	return (
		<>
			<h1>Freelances</h1>
			{freelances?.map((freelance) => (
				<li key={freelance?.id}>
					<Link href={`/freelances/${freelance?.id}`}>{freelance?.email}</Link>
				</li>
			))}
		</>
	);
}

export async function getServerSideProps() {
	const fetchFreelances = async () => {
		const { data } = await client.GET("/api/rest/freelances");
		return data?.freelances as Freelance[];
	};

	return {
		props: {
			freelances: await fetchFreelances(),
		},
	};
}
