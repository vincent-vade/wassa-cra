import { useEffect, useState, useRef } from "react";
import { Toaster, useToaster } from '../../components/Toaster';
import { NumberInput } from "~/components/InputNumber";
import { updateArrayByUniqKey } from "~/lib/array/updateArrayByUniqKey";
import {
	Days,
	getAllDaysInCurrentMonth,
	getCurrentMonth,
	isWeekendDay,
} from "~/lib/date";
import {CreateTimesheet, Project, ProjectTasks} from "~/lib/client"
import { getProjects } from "~/services/projects";
import {getProjectTasks, getProjectTasksByProjectId} from "~/services/projectTasks";
import {createTimesheet} from "~/services/timesheets";
import {TimesheetRow} from "~/components/TimesheetRow";
import dayjs from "dayjs";
import localFont from "next/dist/compiled/@next/font/dist/local";
import {TimesheetRowTotal} from "~/components/TimesheetRowTotal";

const projectTaskId = "13e43911-7a28-46d4-a844-b8cbbdfc9b9a"
const client_id = "c27563bd-e1ee-4b20-8bab-fbc970a72178"
const freelance_id = "dec52fe8-0b27-41f7-94e3-b9eb04fab852"

const getNbWorkingDays = (days: Days) => days.reduce(
	(acc, day) => (isWeekendDay(day.dayOfWeek) ? acc : acc + 1),
	0,
);

type Task = {
	projectName: string
	taskTitle: string
	projectTaskId: string
}
type Timesheet = Task[]

export type ProjectSelection = { projectId: string, projectName: string }
export type TaskSelection = { projectTaskId: string, taskTitle: string }

const EmptyRow = () => {
	return (<tr>
		<td colSpan={9} align={'center'} style={{color: '#CC0000', fontStyle: 'italic'}}>Please select a project and add some task(s)...</td>
	</tr>)
}

const buildTimesheetDate = (month) => {
	return dayjs().month(month - 1).format('YYYY-MM')
}

const add = (a, b) => a + b
const arraySum = (arr: number[]) => Array.isArray(arr) ? arr.reduce(add, 0) : 0

const calculateRowTotal = (timesheets: {[key: string]: number[]}): number[] => {
	if (Object.values(timesheets).length === 0) return [0]

	return Object.values(timesheets).reduce((acc, el) => {
		return acc.map((a, idx) => {
			return a + el[idx]
		})
	})
}

const isStatusFullfilled = ({status}: {status: string}) => status === "fulfilled"

const isAllPromiseSettled = (promises: PromiseSettledResult<any>[]) => {
	return promises.every(isStatusFullfilled)
}

export default function CreateTimesheetPage({projects}: { projects: Project[] }) {
	const [month, setMonth] = useState<number>(dayjs().get('month') + 1);
	const [timesheet, setTimesheet] = useState<Timesheet>([]);
	const [timesheets, setTimesheets] = useState<{[key: string]: number[]}>({});
	const [timesheetTotalDays, setTimesheetTotalDays] = useState(0);
	const [timesheetTotalRow, setTimesheetTotalRow] = useState<number[]>([0]);
	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(null);
	const [timesheetDate, setTimesheetDate] = useState<string>(buildTimesheetDate(month));

	const [project, setProject] = useState<ProjectSelection>(null);
	const [task, setTask] = useState<TaskSelection>(null);

	const toaster = useToaster();

	const selectProjectRef = useRef<HTMLSelectElement>(null);
	const selectTaskRef = useRef<HTMLSelectElement>(null);

	const days = getAllDaysInCurrentMonth(month);

	const handleChangeProject = async () => {
		const [projectId, projectName] = selectProjectRef.current?.value.split('#');

		if (!projectId) {
			setProjectTasks(null)
			return
		}

		setProject({
			projectId,
			projectName,
		});

		const projectTasks = await getProjectTasksByProjectId(projectId)

		setProjectTasks(projectTasks)
	}

	const handleClickTaskAdd = async () => {
		const [projectTaskId, taskTitle] = selectTaskRef.current?.value.split('#');

		// console.log("Freelance ID =>", freelance_id);
		// console.log("Selected Project ID =>", project.projectId);
		// console.log("Selected Project Name =>", project.projectName);
		// console.log("Selected ProjectTask ID =>", projectTaskId);

		if (taskTitle) {
			setTimesheet([
				...timesheet,
				{
					projectName: project.projectName,
					projectTaskId,
					taskTitle,
				}
			])

			setTask({
				projectTaskId,
				taskTitle,
			});
		} else {
			alert("Please select a task")
		}
	}

	const handleClickPrevious = () => {
		setMonth(month - 1);
	}

	const handleClickNext = () => {
		setMonth(month + 1);
	}

	const handleUpdateTimesheet = (projectTaskId: string, days: number[]) => {
		const newTimesheets = {
			...timesheets,
			[projectTaskId]: days,
		}

		setTimesheets(newTimesheets)
	}

	const handleClickSave = async () => {
		if (!project || !task) {
			alert("Please select a project and a task")
			return
		}

		const [projectTaskId] = selectTaskRef?.current?.value.split('#')

		// console.log("Freelance ID =>", freelance_id);
		// console.log("Selected Project ID =>", project.projectId);
		// console.log("Selected Project Name =>", project.projectName);
		// console.log("Selected ProjectTask ID =>", projectTaskId);
		//
		// console.log('timesheets =>', timesheets)

		const promises = Object.entries(timesheets).map(async ([key, timesheet]) => {
			return await createTimesheet({
				object: {
					working_durations: timesheet,
					working_date: timesheetDate,
					client_id: client_id,
					freelance_id: freelance_id,
					project_task_id: key
				}
			} as CreateTimesheet)
		})

		const results = await Promise.allSettled(promises)

		if ( isAllPromiseSettled(results)) {
			toaster('Timesheet created successfully!', 'success');
		} else {
			toaster('An error occurred while creating the timesheet!', 'error');
		}
	}

	useEffect(() => {
		setTimesheetDate(buildTimesheetDate(month))
	}, [month])

	useEffect(() => {
		const rowTotal = calculateRowTotal(timesheets)
		const total = arraySum(rowTotal)

		setTimesheetTotalRow(rowTotal)
		setTimesheetTotalDays(total as number)
	}, [timesheets])

	return (
		<div style={{ "maxWidth": "80%" }}>
			<h2>Create Timesheet</h2>

			<div className="mb-3" style={{'display': 'flex', 'justifyContent': 'space-between'}}>
				<button onClick={handleClickPrevious}>&lt;</button>

				<span  style={{'textAlign': 'center'}}>
					<span className="text-4xl font-bold">{getCurrentMonth(month)}</span>
					<span style={{fontStyle: "italic"}}>(working days: <strong>{getNbWorkingDays(days)}</strong>)</span>
				</span>

				<button  onClick={handleClickNext}>&gt;</button>
			</div>

			<hr  className="mb-3" />

			<div className={"mb-3"}>
				<span style={{display: "inline-block", minWidth: '100px', fontWeight: 'bold'}}>Projects</span>
				<select ref={selectProjectRef} className="ml-2" onChange={handleChangeProject}>
					<option value="">Select a project</option>
					{projects.map((project: Project) => (
						<option key={project.id} value={`${project.id}#${project.name}`}>{project.name}</option>
					))}
				</select>
			</div>

			{
				projectTasks && (
					<div className={"mb-3"}>
						<span style={{display: "inline-block", minWidth: '100px', fontWeight: 'bold'}}>Tasks</span>
						<select ref={selectTaskRef} className="ml-2">
							<option value="">Select a project task</option>
							{projectTasks.map((projectTask) => (
								<option key={projectTask.id} value={`${projectTask.id}#${projectTask.task_description}`}>{projectTask.task_description}</option>
							))}
						</select>
						<button className="button" onClick={handleClickTaskAdd}>ADD</button>
					</div>
				)
			}

			<hr  className="mb-3" />

			<div style={{ "overflowX": "auto" }}>
				<table>
					<thead>
					<tr>
						<td style={{minWidth: '110px'}}></td>
						{
							days.map((day) => {
								return (
									<td  key={day.currDate} className={isWeekendDay(day.dayOfWeek) ? "bg-gray-200" : ""} style={{ "textAlign": "center", "fontWeight": "bold", "minWidth": "58px" }}>
										<p>{day.currDate}</p>
									</td>
								);
							})
						}
						<td style={{ "textAlign": "center", "fontWeight": "bold", "minWidth": "110px" }}>Total</td>
					</tr>
					</thead>
					<tbody>
					{
						timesheet.length === 0 ? <EmptyRow />  : timesheet.map((task) => {
							return (<TimesheetRow task={task} days={days} handleUpdateTimesheet={handleUpdateTimesheet} />)
						})
					}

					{
						timesheet.length > 0 && <TimesheetRowTotal
							days={days}
							timesheetTotalRow={timesheetTotalRow}
							timesheetTotalDays={timesheetTotalDays}
						/>
					}

					</tbody>
				</table>
			</div>

			<div>
				<button onClick={handleClickSave}>Save timesheet</button>
			</div>

			<Toaster />
		</div>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			projects: await getProjects(),
		},
	};
}
