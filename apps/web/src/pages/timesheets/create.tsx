import { useEffect, useState, useRef } from "react";

import { NumberInput } from "~/components/InputNumber";
import { updateArrayByUniqKey } from "~/lib/array/updateArrayByUniqKey";
import {
	getAllDaysInCurrentMonth,
	getCurrentMonth,
	isWeekendDay,
} from "~/lib/date";
import {CreateTimesheet, Project, ProjectTasks} from "~/lib/client"
import { getProjects } from "~/services/projects";
import {getProjectTasks, getProjectTasksByProjectId} from "~/services/projectTasks";
import {createTimesheet} from "~/services/timesheets";
import {TimesheetRow} from "~/components/TimesheetRow";

const currentMonth = 2

const days = getAllDaysInCurrentMonth(currentMonth);

const freelance_id = "7db4eb70-6290-4e3c-afa8-8516b8501b99"

const sumTotalDaysWorked = (
	totalDaysWorked: { value: number; currDate: string }[],
) => totalDaysWorked.reduce((acc, curr) => acc + curr.value, 0);

const workingDays = days.reduce(
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

const EmptyRow = () => {
	return (<tr>
		<td colSpan={9} align={'center'} style={{color: '#CC0000', fontStyle: 'italic'}}>Please select a project and add some task(s)...</td>
	</tr>)
}

export default function CreateTimesheetPage({projects}: { projects: Project[] }) {
	const [timesheet, setTimesheet] = useState<Timesheet>([]);
	const [showTimesheet, setShowTimesheet] = useState<Boolean>(false);
	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(null);
	const [project, setProject] = useState<ProjectSelection>(null);

	const selectProjectRef = useRef<HTMLSelectElement>(null);
	const selectTaskRef = useRef<HTMLSelectElement>(null);

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
		console.log('selectTaskRef.current', selectTaskRef.current.value)
		const [projectTaskId, taskTitle] = selectTaskRef.current?.value.split('#');
		console.log("Freelance ID =>", freelance_id);
		console.log("Selected Project ID =>", project.projectId);
		console.log("Selected Project Name =>", project.projectName);
		console.log("Selected ProjectTask ID =>", projectTaskId);

		setShowTimesheet(true)

		if (taskTitle) {
			setTimesheet([
				...timesheet,
				{
					projectName: project.projectName,
					projectTaskId,
					taskTitle,
				}
			])
		} else {
			alert("Please select a task")
		}
		// const result = await createTimesheet({
		// 	working_duration: 1,
		// 	working_date: "2025",
		// 	working_unit: "day",
		// 	client_id: "1ef26d92-8049-4db3-b637-34a25f786564", // Client 1
		// 	freelance_id: freelance_id, // Gael Cadoret
		// 	project_task_id: projectTaskId, // Developpement Javascript
		// } as CreateTimesheet)
		// console.log("Result =>", result);
	}

	const handleClickPreview = () => {
		console.log("Select previous month");
	}

	const handleClickNext = () => {
		console.log("Select next month");
	}

	return (
		<div style={{ "maxWidth": "80%" }}>
			<h2>Create Timesheet</h2>

			<div className="mb-3" style={{'display': 'flex', 'justifyContent': 'space-between'}}>
				<button onClick={handleClickPreview}>&lt;</button>
				<span  style={{'textAlign': 'center'}}>
					<span className="text-4xl font-bold">{getCurrentMonth(currentMonth)}</span>
					<span style={{fontStyle: "italic"}}>(working days: <strong>{workingDays}</strong>)</span>
				</span>

				<button  onClick={handleClickNext}>&gt;</button>
			</div>

			<hr  className="mb-3" />

			<div className={"mb-3"}>
				<span>Projects</span>
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
						<span>Tasks</span>
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
