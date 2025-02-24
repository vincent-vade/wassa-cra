import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { CreateTimesheet, Project, ProjectTasks } from "~/lib/client";
import { getAllDaysInCurrentMonth } from "~/lib/date";
import { getProjectTasksByProjectId } from "~/services/projectTasks";
import { getProjects } from "~/services/projects";
import { createTimesheet } from "~/services/timesheets";

import { Timesheet } from "~/components/Timesheet";
import { TimesheetHeader } from "~/components/TimesheetHeader";
import { Layout } from "~/components/layout";

const projectTaskId = "13e43911-7a28-46d4-a844-b8cbbdfc9b9a";
const client_id = "c27563bd-e1ee-4b20-8bab-fbc970a72178";
const freelance_id = "dec52fe8-0b27-41f7-94e3-b9eb04fab852";

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

const isAllPromiseSettled = (promises: PromiseSettledResult<any>[]) => {
	return promises.every(isStatusFullfilled);
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

export default function CreateTimesheetPage({
	projects,
}: { projects: Project[] }) {
	const [month, setMonth] = useState<number>(dayjs().get("month") + 1);
	const [nbDays, setNbDays] = useState<number>(
		getAllDaysInCurrentMonth(dayjs().get("month") + 1).length,
	);
	const [tasks, setTasks] = useState<Tasks>([]);

	const [projectTasks, setProjectTasks] = useState<ProjectTasks>(null);
	const [timesheetDate, setTimesheetDate] = useState<string>(
		buildTimesheetDate(month),
	);

	const [project, setProject] = useState<ProjectSelection>(null);
	const [task, setTask] = useState<TaskSelection>(null);

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

		const promises = tasks.map(async (task) => {
			return await createTimesheet({
				object: {
					working_durations: task.row,
					working_date: timesheetDate,
					client_id: client_id,
					freelance_id: freelance_id,
					project_task_id: task.projectTaskId,
				},
			} as CreateTimesheet);
		});

		const results = await Promise.allSettled(promises);

		if (isAllPromiseSettled(results)) {
			notifications.show({
				title: "Success",
				message: "Timesheet created successfully!",
				color: "green",
			});
		} else {
			notifications.show({
				title: "Error",
				message: "An error occurred while creating the timesheet!",
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
		const tasksFromLocalStorage = loadTasksFromLocalStorage(timesheetDate);
		setTasks(tasksFromLocalStorage);
	}, []);

	useEffect(() => {
		console.log("month has been updated", month);

		const newDate = buildTimesheetDate(month);
		setTimesheetDate(newDate);

		const tasksFromLocalStorage = loadTasksFromLocalStorage(newDate);

		if (tasksFromLocalStorage.length > 0) {
			setTasks(tasksFromLocalStorage);
		}

		return () => {
			if (Array.isArray(tasksRef.current) && tasksRef.current.length > 0) {
				saveTasksToLocalStorage(timesheetDateRef.current, tasksRef.current);
				resetTimesheet(tasks);
			} else {
				console.log("no tasks to save...");
			}
		};
	}, [month]);

	useEffect(() => {
		console.log("nbDays have been updated", nbDays);
	}, [nbDays]);

	useEffect(() => {
		tasksRef.current = tasks;
	}, [tasks]);

	useEffect(() => {
		timesheetDateRef.current = timesheetDate;
	}, [timesheetDate]);

	return (
		<Layout>
			<h2>
				<Link href={`/timesheets`}>&lt;</Link> Create Timesheet
			</h2>

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

export async function getServerSideProps() {
	return {
		props: {
			projects: await getProjects(),
		},
	};
}
