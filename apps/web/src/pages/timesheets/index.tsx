import Link from "next/link";
import { type Timesheet } from "~/lib/client";
import { getTimesheets } from "~/services/timesheets";

export default function Timesheets({
	timesheets,
}: { timesheets: Timesheet[] }) {
	return (
		<>
			<Link href={"/timesheets/create"}>Create a new timesheet</Link>
			<h1>Timesheets</h1>
			{timesheets?.map((timesheet) => (
				<li key={timesheet?.id}>
					<Link href={`/timesheets/${timesheet?.id}`}>{timesheet?.created_at}</Link>
				</li>
			))}
		</>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			timesheets: await getTimesheets(),
		},
	};
}
