import { type Timesheet, client } from "~/lib/client";

export default function TimesheetPage({ timesheet }: { timesheet: Timesheet }) {
	return (
		<>
			<h1>{timesheet?.freelance_id}</h1>
		</>
	);
}

export async function getServerSideProps({
	params,
}: { params: { id: string } }) {
	const fetchTimesheet = async (id: string) => {
		const { data } = await client.GET("/api/rest/timesheets/{id}", {
			params: {
				path: {
					id,
				},
				params: {},
			},
		});
		return data?.timesheets_by_pk;
	};

	return {
		props: {
			timesheet: await fetchTimesheet(params.id),
		},
	};
}
