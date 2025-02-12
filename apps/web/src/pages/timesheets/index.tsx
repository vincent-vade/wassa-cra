import Link from "next/link";
import { getTimesheets } from "~/services/timesheets";

import {useAuth} from "~/context/AuthContext";

const add = (a, b) => a + b

export default function Timesheets({
	timesheets,
}: { timesheets: Record<string, unknown> }) {
	const { user } = useAuth();
	console.log('[Timesheets] user', user)

	return (
		<>
			<Link href={"/timesheets/create"}>Create a new timesheet</Link>
			<h1>Timesheets</h1>

			<table>
				<thead>
					<tr>
						<th>Period</th>
						<th>Created at</th>
						<th>Project / task</th>
						<th>Duration (day(s))</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(timesheets).length > 0 && Object.entries(timesheets).map(([period, timesheet]) => (
						<tr key={timesheet?.ids[0]}>
							<td width="70px">
								<Link href={`/timesheets/${period}`}>{period}</Link>
							</td>
							<td>
								{timesheet?.created_at}
							</td>
							<td>
								{timesheet.tasks.length}
							</td>
							<td>
								{timesheet.duration}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

export async function getServerSideProps() {
	const timesheets = await getTimesheets();

	// group timesheets by working_date and sum working_durations
	const groupedTimesheets = timesheets.reduce((acc, timesheet) => {
		const key = timesheet.working_date
		const value = timesheet.working_durations.reduce(add, 0)

		if (!acc[key]) {
			return {
				...acc,
				[key]: {
					ids: [timesheet.id],
					created_at: timesheet.created_at,
					client_id: timesheet.client_id,
					tasks: [timesheet.project_task_id],
					duration: value
				},
			}
		}

		return {
			...acc,
			[key]: {
				ids: [...acc[key].ids, timesheet.id],
				created_at: timesheet.created_at,
				client_id: timesheet.client_id,
				tasks: [...acc[key].tasks, timesheet.project_task_id],
				duration: (acc[key].duration || 0) + value
			},
		}

	}, {})

	return {
		props: {
			timesheets: groupedTimesheets,
		},
	};
}
