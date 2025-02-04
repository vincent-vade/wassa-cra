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
		<div className="grid grid-flow-col">
			{days.map((day) => (
				<div
					key={day.currDate}
					className={`${isWeekDay(day.dayOfWeek) ? "bg-gray-300" : "bg-gray-100"}`}
				>
					<p className="text-center pt-2">{day.currDate}</p>
					<NumberInput
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
