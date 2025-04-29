import { getCookie } from 'cookies-next/server';

import { notifications } from "@mantine/notifications";
import {FetchResponse} from "openapi-fetch";
import {GetServerSidePropsContext} from "next";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import dayjs from "dayjs";

import {
	createTimesheet,
	getTimesheetsByPeriod,
	getTimesheetsByProjectTaskIdAndPeriod,
	updateTimesheetByPeriod,
} from "~/services/timesheets";
import { Layout } from "~/components/layout";
import {TimesheetHeader} from "~/components/TimesheetHeader";
import {Timesheet} from "~/components/Timesheet";
import {getProjectById, getProjects} from "~/services/projects";
import {getAllDaysInCurrentMonth} from "~/lib/date";
import {CreateTimesheet, Project, Projects, ProjectTasks, ProjetTask, TimesheetsByPeriod} from "~/lib/client";
import {getProjectTasksById, getProjectTasksByProjectId} from "~/services/projectTasks";

export type Task = {
	projectName: string;
	taskTitle: string;
	projectTaskId: string;
	row: number[];
};
export type Tasks = Task[];

export type ProjectSelection = { projectId: string; projectName?: string };

const buildTimesheetDate = (month: number) => {
	console.log('[buildTimesheetDate] month =>', month)

	return dayjs()
		.month(month - 1)
		.format("YYYY-MM");
};

const isStatusFullfilled = ({ status }: { status: string }) =>
	status === "fulfilled";

const isResponseOk = ({ value }: FetchResponse) => value.response.ok;

const isAllPromiseFullfilled = (promises: PromiseSettledResult<unknown>[]) => {
	return promises.every(isStatusFullfilled);
};

const isAllPromiseSucceeded = (promises: PromiseSettledResult<unknown>[]) => {
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

const fullFilledErrorFilter = (result: PromiseSettledResult<unknown>) => result.status === "fulfilled" && result.value?.error;
const buildErrorMessage = (result: PromiseSettledResult<unknown>) => {
	return `${result.value?.error?.code}: ${result.value?.error?.error}`
}
const buildErrorMessages = (results: PromiseSettledResult<unknown>[]) => {
	const errors = results
		.filter(fullFilledErrorFilter)
		.map(buildErrorMessage);

	return errors.join(" - ");
};

const buildTasks = (timesheets: TimesheetsByPeriod): Tasks => {
	if (!Array.isArray(timesheets) || timesheets.length === 0) return []

	return timesheets.map((timesheet) => {
		return {
			projectName: timesheet.projects_task?.project?.name,
			projectTaskId: timesheet.project_task_id,
			taskTitle: timesheet.projects_task?.task_description,
			row: timesheet.working_durations,
		} as Task;
	})
}

export default function Timesheets({
	freelance_id,
	_timesheetDate,
	_month,
	_projects,
}: { freelance_id: string, _timesheetDate: string, _month: number, _projects: Projects }) {
	const [month, setMonth] = useState<number>(_month);
	const [timesheetDate, setTimesheetDate] = useState<string>(_timesheetDate);
	const [nbDays, setNbDays] = useState<number>(
		getAllDaysInCurrentMonth(dayjs().get("month") + 1).length,
	);
	const [tasks, setTasks] = useState<Tasks>([]);
	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(undefined);

	const [project, setProject] = useState<ProjectSelection>(undefined);
	const [projectTask, setProjectTask] = useState<ProjetTask>(undefined);


	const selectProjectRef = useRef<HTMLSelectElement>(undefined);
	const selectTaskRef = useRef<HTMLSelectElement>(undefined);
	const tasksRef = useRef<Tasks>(tasks);
	const timesheetDateRef = useRef<string>(timesheetDate);

	const handleChangeProjectTasks = async (e: ChangeEvent<HTMLSelectElement>) => {
		const projectTaskId = e.target.value

		const projectTask = await getProjectTasksById(projectTaskId)

		setProjectTask(projectTask);
	}
	const handleChangeProject = async (e: ChangeEvent<HTMLSelectElement>) => {
		const projectId = e.target.value

		if (!projectId) {
			setProjectTasks(undefined);
			return;
		}

		const project = await getProjectById(projectId)

		setProject({
			projectId,
			projectName: project?.name,
		});

		const projectTasks = await getProjectTasksByProjectId(projectId);

		setProjectTasks(projectTasks);
	};
	const handleClickTaskAdd = () => {
		if (projectTask && project) {
			console.log('tasks', tasks)

			const found = tasks.find((task) => task.projectTaskId === projectTask.id);

			if (!found) {
				setTasks([
					...tasks,
					{
						projectName: project.projectName,
						projectTaskId: projectTask?.id,
						taskTitle: projectTask?.task_description,
						row: Array.from({ length: nbDays }, () => 0),
					},
				]);
			} else {
				notifications.show({
					title: "Error",
					message: "This task already exists in the current timesheet",
					color: "red",
					position: "bottom-center",
				})
			}

		} else {
			alert("Please select a task");
		}
	};
	const handleClickPrevious = () => {
		const previousMonth = month - 1;
		const nbDaysPreviousMonth = getAllDaysInCurrentMonth(previousMonth).length;
		setMonth(previousMonth);
		setNbDays(nbDaysPreviousMonth);
		setTimesheetDate(buildTimesheetDate(previousMonth));

		// resetTimesheet();
	};
	const handleClickNext = () => {
		const nextMonth = month + 1;
		const nbDaysNextMonth = getAllDaysInCurrentMonth(nextMonth).length;
		setMonth(nextMonth);
		setNbDays(nbDaysNextMonth);
		setTimesheetDate(buildTimesheetDate(nextMonth));

		// resetTimesheet();
	};
	const handleClickSave = async () => {
		if (tasks.length === 0) {
			alert("Please select a project/task and add it to the current timesheet");
			return;
		}

		// const response = await getTimesheetsByPeriod(auth?.user?.id, timesheetDate)

		const promises = tasks.map(async (task: Task) => {

			const response = await getTimesheetsByProjectTaskIdAndPeriod(freelance_id, timesheetDate, task.projectTaskId)

			if (response.length === 0) {
				console.log('no timesheet found for this projectTaskId and period')

				return await createTimesheet({
					object: {
						working_durations: task.row,
						working_date: timesheetDate,
						freelance_id,
						project_task_id: task.projectTaskId,
					},
				} as CreateTimesheet);
			} else {
				return await updateTimesheetByPeriod(freelance_id, timesheetDate, task.projectTaskId, task.row)
			}
		});

		const results = await Promise.allSettled(promises);

		if (isAllPromiseFullfilled(results)) {
			console.log("results", results);
			if (isAllPromiseSucceeded(results)) {
				notifications.show({
					title: "Success",
					message: "Timesheet created successfully!",
					color: "green",
					position: "bottom-center",
				});
			} else {
				const errorMessage = buildErrorMessages(results);
				notifications.show({
					title: "Error",
					message: errorMessage,
					color: "red",
					position: "bottom-center",
				});
			}
		} else {
			notifications.show({
				title: "Error",
				message: "An error occurred while creating the timesheet!",
				color: "blue",
				position: "bottom-center",
			});
		}
	};

	const updateTaskById = (task: Task) => {
		const newTasks = updateTasks(tasks, task);

		setTasks(newTasks);
	};
	const handleUpdateTasks = (task: Task) => {
		updateTaskById(task);
	};

	useEffect(() => {
		console.log('***** INIT *****')
		console.log('tasks.length', tasks.length)
		console.log('timesheetDate', timesheetDate)

		// if (tasks.length === 0) {
		// 	const tasksFromLocalStorage = loadTasksFromLocalStorage(timesheetDate);
		// 	setTasks(tasksFromLocalStorage);
		// } else {
		// 	console.log("no tasks to load from localStorage... Data comes fron database");
		// }
	}, []);

	// useEffect(() => {
	// 	console.log("month has been updated", month);
	//
	// 	const newDate = buildTimesheetDate(month);
	// 	setTimesheetDate(newDate);
	//
	// 	// const tasksFromLocalStorage = loadTasksFromLocalStorage(newDate);
	// 	//
	// 	// if (tasksFromLocalStorage.length > 0) {
	// 	// 	setTasks(tasksFromLocalStorage);
	// 	// }
	//
	// 	// return () => {
	// 	// 	if (Array.isArray(tasksRef.current) && tasksRef.current.length > 0) {
	// 	// 		saveTasksToLocalStorage(timesheetDateRef.current, tasksRef.current);
	// 	// 		resetTimesheet(tasks);
	// 	// 	} else {
	// 	// 		console.log("no tasks to save...");
	// 	// 	}
	// 	// };
	// }, [month]);

	const fetchTasks = async () => {
		console.log('%c fetchTasks ', 'background-color: #006600')
		console.log('freelance_id =>', freelance_id)
		console.log('timesheetDate =>', timesheetDate)
		const timesheets = await getTimesheetsByPeriod(freelance_id, timesheetDate)
		console.log('[DB] timesheets', timesheets)
		setTasks(buildTasks(timesheets))
	}

	useEffect(() => {
		console.log(`%c [useEffect] %c month has been updated => %c ${month} `, 'background-color: #660000', 'background-color: #333', 'background-color: yellow; color: black; font-weight: bold;');

		fetchTasks()

		return () => {
			console.log('***** CLEANUP *****')
			console.log('month =>', month)
			setTasks([])
		}
	}, [month])

	useEffect(() => {
		console.log(`%c [useEffect] %c tasks have been updated - nb task(s) => %c ${tasks.length} `,'background-color: #660000', 'background-color: #333', 'background-color: yellow; color: black; font-weight: bold;');
		tasksRef.current = tasks;
	}, [tasks]);

	useEffect(() => {
		console.log("[useEffect] timesheetDate has been updated", timesheetDate);
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
				handleChangeProjectTasks={handleChangeProjectTasks}
				handleClickTaskAdd={handleClickTaskAdd}
				refProjectDropdown={selectProjectRef}
				refTaskDropdown={selectTaskRef}
				projects={_projects}
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
			freelance_id,
			_timesheetDate: currentDate,
			_month: dayjs().get("month") + 1,
			_projects: await getProjects(),
		},
	};
}
