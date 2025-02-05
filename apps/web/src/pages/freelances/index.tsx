import Link from "next/link";
import { type Freelance } from "~/lib/client";
import { getFreelances } from "~/services/freelances";

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
	return {
		props: {
			freelances: await getFreelances(),
		},
	};
}
