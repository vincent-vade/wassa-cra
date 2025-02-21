import { getCookie } from 'cookies-next/server';
import {
	createTimesheet,
	getTimesheetsByPeriod,
	getTimesheetsByProjectTaskIdAndPeriod,
	updateTimesheetByPeriod
} from "~/services/timesheets";

import { Layout } from "~/components/layout";
import {TimesheetHeader} from "~/components/TimesheetHeader";
import {Timesheet} from "~/components/Timesheet";
import {getProjects} from "~/services/projects";
import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {getAllDaysInCurrentMonth} from "~/lib/date";
import type {CreateTimesheet, Project, ProjectTasks, TimesheetsByPeriod} from "~/lib/client";
import {useToaster} from "~/context/ToastContext";
import {getProjectTasksByProjectId} from "~/services/projectTasks";
import {ProjectSelection, Task, Tasks, TaskSelection} from "~/pages/admin/timesheets/create";
import {FetchResponse} from "openapi-fetch";
import {useAuth} from "~/context/AuthContext";
import {GetServerSideProps, GetServerSidePropsContext} from "next";

const projectTaskId = "13e43911-7a28-46d4-a844-b8cbbdfc9b9a";
const client_id = "728f81cd-45ab-4cb8-92b6-956fc5c5d256";

export type Task = {
	projectName: string;
	taskTitle: string;
	projectTaskId: string;
	row: number[];
};
export type Tasks = Task[];

export type ProjectSelection = { projectId: string; projectName: string };
export type TaskSelection = { projectTaskId: string; taskTitle: string };

const buildTimesheetDate = (month) => {
	return dayjs()
		.month(month - 1)
		.format("YYYY-MM");
};

const isStatusFullfilled = ({ status }: { status: string }) =>
	status === "fulfilled";

const isResponseOk = ({ value }: FetchResponse) =>
	value.response.ok;

const isAllPromiseFullfilled = (promises: PromiseSettledResult<any>[]) => {
	return promises.every(isStatusFullfilled);
};

const isAllPromiseSucceeded = (promises: PromiseSettledResult<any>[]) => {
	return promises.every(isResponseOk);
};

const overrideRowPropByTaskId = (
	currTaskProjectTaskId: string,
	newTask: Task,
) => {
	if (currTaskProjectTaskId !== newTask.projectTaskId) return {};

	return {
		row: newTask.row,
	};
};
const overrideTaskRow = (tasks: Tasks, newTask: Task) => (currTask: Task) => {
	return {
		...currTask,
		...overrideRowPropByTaskId(currTask.projectTaskId, newTask),
	};
};
const updateTasks = (tasks: Tasks, task: Task) =>
	tasks.map(overrideTaskRow(tasks, task));

const saveTasksToLocalStorage = (date: string, tasks: Tasks) => {
	if (!/^\d{4}-\d{2}$/.test(date)) {
		console.error("La date doit être au format YYYY-MM");
		return;
	}

	if (!date) return;

	localStorage.setItem(date, JSON.stringify(tasks));
};
const loadTasksFromLocalStorage = (date: string) => {
	if (!/^\d{4}-\d{2}$/.test(date)) {
		console.error("La date doit être au format YYYY-MM");
		return;
	}

	if (!date) return [];

	const tasks = JSON.parse(localStorage.getItem(date));

	return tasks ?? [];
};

const buildErrorMessage = (results: PromiseSettledResult<any>[]) => {
	const errors = results
		.filter((result) => result.status === "fulfilled")
		.map((result) => `${result.value.error.code}: ${result.value.error.error}`);

	return errors.join(" - ");
}

/**
 * Data from localStorage working with Timesheets component
 * [
 *     {
 *         "projectName": "Headless ONE",
 *         "projectTaskId": "b86bd374-8585-42a2-8fc5-2e61b238c36d",
 *         "taskTitle": "JavaScript development",
 *         "row": []
 *     }
 * ]
 *
 * [
 *     {
 *         "id": "73856699-c11e-4e95-a9fc-afc726041b5f",
 *         "client_id": "728f81cd-45ab-4cb8-92b6-956fc5c5d256",
 *         "client": {
 *             "name": "Client 1"
 *         },
 *         "project_task_id": "b86bd374-8585-42a2-8fc5-2e61b238c36d",
 *         "projects_task": {
 *             "task_description": "JavaScript development",
 *             "project_id": "ca023d6d-71ca-41fd-b318-2bf9d319a092",
 *             "project": {
 *                 "name": "Headless ONE",
 *                 "description": null
 *             }
 *         },
 *         "created_at": "2025-02-18T21:47:54.582475",
 *         "updated_at": null,
 *         "working_date": "2025-02",
 *         "working_durations": []
 *     }
 * ]
 */

const buildTasks = (timesheets) => {
	return timesheets.map((timesheet) => {
		return {
			projectName: timesheet.projects_task.project.name,
			projectTaskId: timesheet.project_task_id,
			taskTitle: timesheet.projects_task.task_description,
			row: timesheet.working_durations,
		};
	})
}

export default function Timesheets({
	projects,
	timesheets,
}: { projects: Project[], timesheets: TimesheetsByPeriod }) {
	console.log('timesheets', timesheets)
	const [month, setMonth] = useState<number>(dayjs().get("month") + 1);
	const [nbDays, setNbDays] = useState<number>(
		getAllDaysInCurrentMonth(dayjs().get("month") + 1).length,
	);
	const [tasks, setTasks] = useState<Tasks>(buildTasks(timesheets));

	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(null);
	const [timesheetDate, setTimesheetDate] = useState<string>(
		buildTimesheetDate(month),
	);

	const [project, setProject] = useState<ProjectSelection>(null);
	const [task, setTask] = useState<TaskSelection>(null);

	const toaster = useToaster();
	const auth = useAuth()

	const selectProjectRef = useRef<HTMLSelectElement>(null);
	const selectTaskRef = useRef<HTMLSelectElement>(null);
	const tasksRef = useRef<Tasks>(tasks);
	const timesheetDateRef = useRef<string>(timesheetDate);

	const handleChangeProject = async () => {
		const [projectId, projectName] = selectProjectRef.current?.value.split("#");

		if (!projectId) {
			setProjectTasks(null);
			return;
		}

		setProject({
			projectId,
			projectName,
		});

		const projectTasks = await getProjectTasksByProjectId(projectId);

		setProjectTasks(projectTasks);
	};
	const handleClickTaskAdd = () => {
		const [projectTaskId, taskTitle] = selectTaskRef.current?.value.split("#");

		if (projectTaskId && taskTitle) {
			setTasks([
				...tasks,
				{
					projectName: project.projectName,
					projectTaskId,
					taskTitle,
					row: Array.from({ length: nbDays }, () => 0),
				},
			]);

			setTask({
				projectTaskId,
				taskTitle,
			});
		} else {
			alert("Please select a task");
		}
	};
	const handleClickPrevious = () => {
		const previousMonth = month - 1;
		const nbDaysPreviousMonth = getAllDaysInCurrentMonth(previousMonth).length;
		setMonth(previousMonth);
		setNbDays(nbDaysPreviousMonth);
	};
	const handleClickNext = () => {
		const nextMonth = month + 1;
		const nbDaysNextMonth = getAllDaysInCurrentMonth(nextMonth).length;
		setMonth(nextMonth);
		setNbDays(nbDaysNextMonth);
	};
	const handleClickSave = async () => {
		if (tasks.length === 0) {
			alert("Please select a project/task and add it to the current timesheet");
			return;
		}

		// const response = await getTimesheetsByPeriod(auth?.user?.id, timesheetDate)

		const promises = tasks.map(async (task: Task) => {

			const response = await getTimesheetsByProjectTaskIdAndPeriod(auth?.user?.id, timesheetDate, task.projectTaskId)

			if (response.length === 0) {
				console.log('no timesheet found for this projectTaskId and period')

				return await createTimesheet({
					object: {
						working_durations: task.row,
						working_date: timesheetDate,
						client_id: client_id,
						freelance_id: auth?.user?.id,
						project_task_id: task.projectTaskId,
					},
				} as CreateTimesheet);
			} else {
				return await updateTimesheetByPeriod(auth?.user?.id, timesheetDate, task.projectTaskId, task.row)
			}
		});

		const results = await Promise.allSettled(promises);

		if (isAllPromiseFullfilled(results)) {
			console.log('results', results)
			if (isAllPromiseSucceeded(results)) {
				toaster.addToast("Timesheet created successfully!", "success");
			} else {
				const errorMessage = buildErrorMessage(results)
				toaster.addToast(errorMessage, "error");
			}
		} else {
			toaster.addToast("An error occurred while creating the timesheet!", "error");
		}
	};

	const updateTaskById = (task: Task) => {
		const newTasks = updateTasks(tasks, task);

		setTasks(newTasks);
	};
	const handleUpdateTasks = (task: Task) => {
		updateTaskById(task);
	};

	const resetTimesheet = (tasks: Tasks) => {
		const newTasks = tasks.map((task) => {
			return {
				...task,
				row: Array.from({ length: nbDays }, () => 0),
			};
		});

		setTasks(newTasks);
	};

	useEffect(() => {
		console.log('tasks.length', tasks.length)
		console.log('timesheetDate', timesheetDate)
		if (tasks.length === 0) {
			const tasksFromLocalStorage = loadTasksFromLocalStorage(timesheetDate);
			setTasks(tasksFromLocalStorage);
		} else {
			console.log("no tasks to load from localStorage... Data comes fron database");
		}

	}, []);

	useEffect(() => {
		console.log("month has been updated", month);

		const newDate = buildTimesheetDate(month);
		setTimesheetDate(newDate);

		// const tasksFromLocalStorage = loadTasksFromLocalStorage(newDate);
		//
		// if (tasksFromLocalStorage.length > 0) {
		// 	setTasks(tasksFromLocalStorage);
		// }

		// return () => {
		// 	if (Array.isArray(tasksRef.current) && tasksRef.current.length > 0) {
		// 		saveTasksToLocalStorage(timesheetDateRef.current, tasksRef.current);
		// 		resetTimesheet(tasks);
		// 	} else {
		// 		console.log("no tasks to save...");
		// 	}
		// };
	}, [month]);

	useEffect(() => {
		console.log("nbDays have been updated", nbDays);
	}, [nbDays]);

	useEffect(() => {
		tasksRef.current = tasks;
	}, [tasks]);

	useEffect(() => {
		console.log("timesheetDate has been updated", timesheetDate);
		timesheetDateRef.current = timesheetDate;
	}, [timesheetDate]);

	return (
		<Layout>

			<h1>Timesheets</h1>

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

			<Timesheet
				month={month}
				tasks={tasks}
				handleUpdateTasks={handleUpdateTasks}
				handleClickSave={handleClickSave}
			/>
		</Layout>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const currentDate = dayjs().format("YYYY-MM");
	const freelance_id = await getCookie('token', {
		req: ctx.req,
		res: ctx.res
	})

	return {
		props: {
			projects: await getProjects(),
			timesheets: await getTimesheetsByPeriod(freelance_id, currentDate)
		},
	};
}
