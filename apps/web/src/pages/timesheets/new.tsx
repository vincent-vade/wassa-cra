import { useEffect, useState } from "react";

import { NumberInput } from "~/components/InputNumber";
import { updateArrayByUniqKey } from "~/lib/array/updateArrayByUniqKey";
import {
	getAllDaysInCurrentMonth,
	getCurrentMonth,
	isWeekDay,
} from "~/lib/date";

const days = getAllDaysInCurrentMonth(3);

function Rows({
	handleChangeCell,
}: {
	handleChangeCell?: (days: { value: number; currDate: string }[]) => void;
}) {
	const [totalDaysWorked, setTotalDaysWorked] = useState<
		{ value: number; currDate: string }[]
	>(days.map((day) => ({ value: 0, currDate: day.currDate })));

	useEffect(() => {
		handleChangeCell?.(totalDaysWorked);
	}, [handleChangeCell, totalDaysWorked]);

	return (
		<div>
			<div className="grid grid-cols-12">
				<div className="col-start-2 col-span-11">
					<div className="grid grid-flow-col gap-2">
						{days.map((day) => (
							<div
								key={day.currDate}
								className={`text-center  ${isWeekDay(day.dayOfWeek) ? "bg-gray-300" : "bg-gray-100"}`}
							>
								<p>{day.currDate}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			{["headless", "puls"].map((project) => (
				<div key={project} className="grid grid-cols-12">
					<p>{project}</p>

					<div className="col-span-11">
						<div className="grid grid-flow-col">
							{days.map((day) => (
								<NumberInput
									key={day.currDate}
									disabled={isWeekDay(day.dayOfWeek)}
									handleChange={(value) =>
										setTotalDaysWorked((totalDaysWorked) =>
											updateArrayByUniqKey(
												totalDaysWorked,
												{ value, currDate: day.currDate },
												"currDate",
											),
										)
									}
								/>
							))}
						</div>
					</div>
				</div>
			))}
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

export default function NewTimesheetPage() {
	return (
		<div>
			<h3 className="text-4xl font-bold">{getCurrentMonth(3)}</h3>
			<Project />
			<p className="font-bold text-2xl">Number of days worked: {daysWorked}</p>
		</div>
	);
}
