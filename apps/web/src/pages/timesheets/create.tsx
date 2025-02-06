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

const client_id = "af35fca8-2f16-4f9a-9dfc-ddd6c5678861"
const freelance_id = "d957ca2a-b92a-44f8-90c6-7c51af980ff2"

const sumTotalDaysWorked = (
	totalDaysWorked: { value: number; currDate: string }[],
) => totalDaysWorked.reduce((acc, curr) => acc + curr.value, 0);

const getNbWorkingDays = (days: Days) => days.reduce(
	(acc, day) => (isWeekendDay(day.dayOfWeek) ? acc : acc + 1),
	0,
);

// function Project() {
// 	const [totalDaysWorked, setT] = useState(0);
// 	return (
// 		<div>
// 			<TimesheetRow
// 				handleChangeCell={(totalDaysWorked) =>
// 					setT(sumTotalDaysWorked(totalDaysWorked))
// 				}
// 			/>
// 			<p>{totalDaysWorked}</p>
// 		</div>
// 	);
// }

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

export default function CreateTimesheetPage({projects}: { projects: Project[] }) {
	const [month, setMonth] = useState<number>(dayjs().get('month') + 1);
	const [timesheet, setTimesheet] = useState<Timesheet>([]);
	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(null);

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

		console.log("Freelance ID =>", freelance_id);
		console.log("Selected Project ID =>", project.projectId);
		console.log("Selected Project Name =>", project.projectName);
		console.log("Selected ProjectTask ID =>", projectTaskId);

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

	const handleClickSave = async () => {
		if (!project || !task) {
			alert("Please select a project and a task")
			return
		}

		const [projectTaskId] = selectTaskRef?.current?.value.split('#')

		console.log("Freelance ID =>", freelance_id);
		console.log("Selected Project ID =>", project.projectId);
		console.log("Selected Project Name =>", project.projectName);
		console.log("Selected ProjectTask ID =>", projectTaskId);

		const result = await createTimesheet({
			"object": {
				"working_duration": 1,
				"working_date": "2025",
				"working_unit": "day",
				"client_id": client_id,
				"freelance_id": freelance_id,
				"project_task_id": projectTaskId
			}
		} as CreateTimesheet)

		if (result.response.ok) {
			toaster('Timesheet created successfully!', 'success');
		} else {
			toaster('An error occurred while creating the timesheet!', 'error');
		}

		console.log("Result =>", result);
	}

	const handleClick = () => {
		toaster('This is a success message!', 'success');
	};

	const handleErrorClick = () => {
		toaster('This is an error message!', 'error');
	};

	return (
		<div style={{ "maxWidth": "80%" }}>
			<h2>Create Timesheet</h2>

			<button onClick={handleClick}>Show Success Toast</button>
			<button onClick={handleErrorClick}>Show Error Toast</button>


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
					</tr>
					</thead>
					<tbody>
					{
						timesheet.length === 0 ? <EmptyRow />  : timesheet.map((task) => {
							return (<TimesheetRow task={task} days={days} />)
						})
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
