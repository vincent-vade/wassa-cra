import { useEffect, useState, useRef } from "react";

import { NumberInput } from "~/components/InputNumber";
import { updateArrayByUniqKey } from "~/lib/array/updateArrayByUniqKey";
import {
	getAllDaysInCurrentMonth,
	getCurrentMonth,
	isWeekDay,
} from "~/lib/date";
import { Project } from "~/lib/client"
import { getProjects } from "~/services/projects";

const days = getAllDaysInCurrentMonth(3);

function Rows({
	handleChangeCell,
}: {
	handleChangeCell?: (days: { value: number; currDate: string }[]) => void;
	projects?: Project[];
}) {
	const [totalDaysWorked, setTotalDaysWorked] = useState<
		{ value: number; currDate: string }[]
	>(days.map((day) => ({ value: 0, currDate: day.currDate })));

	useEffect(() => {
		handleChangeCell?.(totalDaysWorked);
	}, [handleChangeCell, totalDaysWorked]);

	return (
		<div style={{ "overflow-x": "auto" }}>
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
						<td><p className="p-2">Headless</p></td>
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
			{/*<h3>{project}</h3>*/}
			<Rows
				handleChangeCell={(totalDaysWorked) =>
					setT(sumTotalDaysWorked(totalDaysWorked))
				}
			/>
			<p>{totalDaysWorked}</p>
		</div>
	);
}

export default function NewTimesheetPage({ projects } : { projects: Project[] }) {
	// const [projects, setProjects] = useState<Project[]>([]);
	const selectProjectRef = useRef<HTMLSelectElement>(null);
	console.log(projects);

	const handleClickAdd = () => {
		const selectedProjectId = selectProjectRef.current?.value;
		console.log("Selected Project ID:", selectedProjectId);
	}

	return (
		<div>

			<h3 className="text-4xl font-bold">{getCurrentMonth(3)}</h3>
			<hr  className="mb-3" />

			<div className={"mb-3"}>
				<span>Projects</span>
				<select ref={selectProjectRef} className="ml-2">
					<option value="">Select a project</option>
					{projects.map((project) => (
						<option key={project.id} value={project.id}>{project.name}</option>
					))}
				</select>
				<button className="button" onClick={handleClickAdd}>ADD</button>
			</div>


			<hr  className="mb-3" />

			<Project />

			<p className="font-bold text-2xl">Number of days worked: {daysWorked}</p>
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
