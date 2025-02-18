import { TimesheetRow } from "~/components/TimesheetRow";
import { Layout } from "~/components/layout";
import type { TimesheetsByPeriod } from "~/lib/client";
import { getAllDaysInCurrentMonth, isWeekendDay } from "~/lib/date";
import { getTimesheetsByPeriod } from "~/services/timesheets";

type TimesheetEdit = {
	durations: number[];
	projectName: string;
	taskTitle: string;
};

export default function TimesheetPage({
	year,
	month,
	timesheet,
}: {
	year: string;
	month: string;
	timesheet: Record<string, TimesheetEdit>[];
}) {
	const days = getAllDaysInCurrentMonth(month);

	return (
		<Layout>
			<h1>{`${year}-${month}`}</h1>

			<table>
				<thead>
					<tr>
						<td style={{ minWidth: "110px" }}></td>
						{days.map((day) => {
							return (
								<td
									key={day.currDate}
									className={isWeekendDay(day.dayOfWeek) ? "bg-gray-200" : ""}
									style={{
										textAlign: "center",
										fontWeight: "bold",
										minWidth: "58px",
									}}
								>
									<p>{day.currDate}</p>
								</td>
							);
						})}
						<td
							style={{
								textAlign: "center",
								fontWeight: "bold",
								minWidth: "110px",
							}}
						>
							Total
						</td>
					</tr>
				</thead>
				<tbody>
					{Object.entries(timesheet).length === 0 ? (
						<EmptyRow />
					) : (
						Object.entries(timesheet).map(([projectTaskId, _task]) => {
							console.log("projectTaskId", projectTaskId);
							const task = {
								taskTitle: _task.taskTitle,
								projectName: _task.projectName,
							};
							return <TimesheetRow task={task} days={_task.durations} />;
						})
					)}
				</tbody>
			</table>
		</Layout>
	);
}

const formatTimesheet = (acc, timesheet: TimesheetsByPeriod) => {
	return {
		...acc,
		[timesheet.project_task_id]: {
			durations: timesheet.working_durations,
			projectName: timesheet.projects_task.project.name,
			taskTitle: timesheet.projects_task.task_description,
		},
	};
};

const formatTimesheets = (timesheets: TimesheetsByPeriod[]) => {
	return timesheets.reduce(formatTimesheet, {});
};

export async function getServerSideProps({
	params: { period },
}: { params: { period: string } }) {
	const [year, month] = period.split("-");

	const timesheets = await getTimesheetsByPeriod(period);

	return {
		props: {
			timesheet: formatTimesheets(timesheets),
			year,
			month,
		},
	};
}
