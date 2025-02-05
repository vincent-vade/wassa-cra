import { useEffect, useState, useRef } from "react";

import { NumberInput } from "~/components/InputNumber";
import { updateArrayByUniqKey } from "~/lib/array/updateArrayByUniqKey";
import {
	getAllDaysInCurrentMonth,
	getCurrentMonth,
	isWeekDay,
} from "~/lib/date";
import {CreateTimesheet, Project, ProjectTasks} from "~/lib/client"
import { getProjects } from "~/services/projects";
import { getProjectTasks } from "~/services/projectTasks";
import {createTimesheet} from "~/services/timesheets";

const days = getAllDaysInCurrentMonth(3);

const freelance_id = "7db4eb70-6290-4e3c-afa8-8516b8501b99"

function Rows({
	handleChangeCell,
	taskTitle,
}: {
	handleChangeCell?: (days: { value: number; currDate: string }[]) => void;
	projects?: Project[];
	taskTitle?: string;
}) {
	const [totalDaysWorked, setTotalDaysWorked] = useState<
		{ value: number; currDate: string }[]
	>(days.map((day) => ({ value: 0, currDate: day.currDate })));

	useEffect(() => {
		handleChangeCell?.(totalDaysWorked);
	}, [handleChangeCell, totalDaysWorked]);

	return (
		<div style={{ "overflowX": "auto" }}>
			<table>
				<thead>
					<tr>
						<td></td>
					{
						days.map((day) => {
							return (
								<td key={day.currDate} className={isWeekDay(day.dayOfWeek) ? "bg-gray-200" : ""} style={{ "textAlign": "center", "fontWeight": "bold" }}>
									<p>{day.currDate}</p>
								</td>
							);
						})
					}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><p className="p-2">{taskTitle}</p></td>
						{
							days.map((day) => {
								return (
									<td key={day.currDate} className={isWeekDay(day.dayOfWeek) ? "bg-gray-200" : ""}>
										<NumberInput
											disabled={isWeekDay(day.dayOfWeek)}
											handleChange={(value) =>
												setTotalDaysWorked((totalDaysWorked) =>
													updateArrayByUniqKey(
														totalDaysWorked,
														{value, currDate: day.currDate},
														"currDate",
													),
												)
											}
										/>
									</td>
								);
							})
						}
					</tr>
				</tbody>
			</table>
		</div>
	);
}

const sumTotalDaysWorked = (
	totalDaysWorked: { value: number; currDate: string }[],
) => totalDaysWorked.reduce((acc, curr) => acc + curr.value, 0);

const daysWorked = days.reduce(
	(acc, day) => (isWeekDay(day.dayOfWeek) ? acc : acc + 1),
	0,
);

function Project() {
	const [totalDaysWorked, setT] = useState(0);
	return (
		<div>
			<Rows
				handleChangeCell={(totalDaysWorked) =>
					setT(sumTotalDaysWorked(totalDaysWorked))
				}
			/>
			<p>{totalDaysWorked}</p>
		</div>
	);
}

export default function CreateTimesheetPage({ projects } : { projects: Project[] }) {
	const [timesheet, setTimesheet] = useState<CreateTimesheet[]>([]);
	const [showTimesheet, setShowTimesheet] = useState<Boolean>(false);
	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(null);
	const [projectId, setProjectId] = useState<string>(null);
	const [taskTitle, setTaskTitle] = useState<string>(null);

	const selectProjectRef = useRef<HTMLSelectElement>(null);
	const selectTaskRef = useRef<HTMLSelectElement>(null);

	const handleChangeProject = async () => {
		const projectId = selectProjectRef.current?.value;

		if (!projectId) {
			setProjectTasks(null)
			return
		}

		setProjectId(projectId);
		const projectTasks = await getProjectTasks()
		setProjectTasks(projectTasks)
	}

	const handleClickTaskAdd = async () => {
		console.log('selectTaskRef.current', selectTaskRef.current.value)
		const [projectTaskId, taskTitle] = selectTaskRef.current?.value.split('#');
		console.log("Freelance ID =>", freelance_id);
		console.log("Selected Project ID =>", projectId);
		console.log("Selected ProjectTask ID =>", projectTaskId);
		setShowTimesheet(!showTimesheet)
		// setTaskTitle(taskTitle)
		if (taskTitle) {
			setTimesheet([
				...timesheet,
				{
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
				<span className="text-4xl font-bold" style={{'textAlign': 'center'}}>{getCurrentMonth(0)}</span>
				<button  onClick={handleClickNext}>&gt;</button>
			</div>

			<hr  className="mb-3" />

			<div className={"mb-3"}>
				<span>Projects</span>
				<select ref={selectProjectRef} className="ml-2" onChange={handleChangeProject}>
					<option value="">Select a project</option>
					{projects.map((project: Project) => (
						<option key={project.id} value={project.id}>{project.name}</option>
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

			{
				timesheet.map((sheet) => {
					return (<Rows taskTitle={sheet.taskTitle} />)
				})
			}

			<p className="font-bold text-2xl">Number of working days: {daysWorked}</p>
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
