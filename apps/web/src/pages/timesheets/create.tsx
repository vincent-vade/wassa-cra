import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";

import { useToaster } from '~/components/Toaster';
import {
	getAllDaysInCurrentMonth,
} from "~/lib/date";
import {CreateTimesheet, Project, ProjectTasks} from "~/lib/client"
import { getProjects } from "~/services/projects";
import { getProjectTasksByProjectId} from "~/services/projectTasks";
import { createTimesheet } from "~/services/timesheets";

import Link from "next/link";
import { TimesheetHeader } from "~/components/TimesheetHeader";
import { Timesheet } from "~/components/Timesheet";

const projectTaskId = "13e43911-7a28-46d4-a844-b8cbbdfc9b9a"
const client_id = "c27563bd-e1ee-4b20-8bab-fbc970a72178"
const freelance_id = "dec52fe8-0b27-41f7-94e3-b9eb04fab852"

export type Task = {
	projectName: string
	taskTitle: string
	projectTaskId: string
	row: number[]
}
export type Tasks = Task[]

export type ProjectSelection = { projectId: string, projectName: string }
export type TaskSelection = { projectTaskId: string, taskTitle: string }

const buildTimesheetDate = (month) => {
	return dayjs().month(month - 1).format('YYYY-MM')
}

const isStatusFullfilled = ({status}: {status: string}) => status === "fulfilled"

const isAllPromiseSettled = (promises: PromiseSettledResult<any>[]) => {
	return promises.every(isStatusFullfilled)
}

export default function CreateTimesheetPage({projects}: { projects: Project[] }) {
	const [month, setMonth] = useState<number>(dayjs().get('month') + 1);
	const [tasks, setTasks] = useState<Tasks>([]);

	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(null);
	const [timesheetDate, setTimesheetDate] = useState<string>(buildTimesheetDate(month));

	const [project, setProject] = useState<ProjectSelection>(null);
	const [task, setTask] = useState<TaskSelection>(null);

	const toaster = useToaster();

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
	const handleClickTaskAdd = () => {
		const [projectTaskId, taskTitle] = selectTaskRef.current?.value.split('#');

		if (projectTaskId && taskTitle) {
			setTasks([
				...tasks,
				{
					projectName: project.projectName,
					projectTaskId,
					taskTitle,
					row: Array.from({ length: getAllDaysInCurrentMonth(month).length }, () => 0)
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

		console.log('tasks', tasks)

		const promises = tasks.map(async (task) => {
			return await createTimesheet({
				object: {
					working_durations: task.row,
					working_date: timesheetDate,
					client_id: client_id,
					freelance_id: freelance_id,
					project_task_id: task.projectTaskId
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
	const updateTaskById = (task: Task) => {
		const newTasks = tasks.map((currTask) => {
			if (currTask.projectTaskId === task.projectTaskId) {
				return {
					...currTask,
					row: task.row
				}
			}

			return currTask
		})

		setTasks(newTasks)
	}
	const handleUpdateTasks = (task: Task) => {
		console.log('[handleUpdateTasks] task =>', task)
		console.log('tasks', tasks)
		updateTaskById(task)
	}

	useEffect(() => {
		setTimesheetDate(buildTimesheetDate(month))
	}, [month])

	return (
		<div style={{ "maxWidth": "80%" }}>
			<h2><Link href={`/timesheets`}>&lt;</Link> Create Timesheet</h2>

			<TimesheetHeader
				handleClickPrevious={handleClickPrevious}
				handleClickNext={handleClickNext}
				month={month}
				handleChangeProject={handleChangeProject}
				handleClickTaskAdd={handleClickTaskAdd}
				refProjectDropdown={selectProjectRef}
				refTaskDropdown={selectTaskRef}
				projects={projects}
				projectTasks={projectTasks}
			/>

			<Timesheet month={month} tasks={tasks}  handleUpdateTasks={handleUpdateTasks} handleClickSave={handleClickSave} />
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
