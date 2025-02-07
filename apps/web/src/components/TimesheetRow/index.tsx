import {useEffect, useState} from "react";
import { Days, isWeekendDay } from "~/lib/date";
import { NumberInput } from "~/components/InputNumber";

export const TimesheetRow = ({
                                 task,
                                 days,
                                 handleUpdateTimesheet
}: {
    task?: { taskTitle: string, projectTaskId: string, projectName: string },
    days: Days,
    handleUpdateTimesheet: (taskId: string, days: number[]) => void
}) => {
    const [totalDaysWorked, setTotalDaysWorked] = useState<number>(0);
    const [daysInput, setDaysInput] = useState<number[]>(days.map(() => 0));

    useEffect(() => {
        const totalDays = daysInput.reduce((acc, curr) => acc + curr, 0);
        setTotalDaysWorked(totalDays);
    }, daysInput)

    const handleChange = (val: number, taskId: string, idx: number): void => {
        const newDaysInput = daysInput.map((input, newIdx) => {
            return newIdx === idx ? val : input;
        });

        setDaysInput(newDaysInput);

        handleUpdateTimesheet(taskId, newDaysInput);
    }

    return (
        <tr>
            <td><p className="p-2">{task.projectName} / {task.taskTitle}</p></td>
            {
                days.map((day, idx) => {
                    return (
                        <td key={day.currDate} className={isWeekendDay(day.dayOfWeek) ? "bg-gray-200" : ""}>
                            <NumberInput
                                idx={idx}
                                taskId={task.projectTaskId}
                                disabled={isWeekendDay(day.dayOfWeek)}
                                handleChange={handleChange}
                            />
                        </td>
                    );
                })
            }
            <td><p style={{ "textAlign": "center", "fontWeight": "bold" }}>{totalDaysWorked}</p></td>
        </tr>
    );
}