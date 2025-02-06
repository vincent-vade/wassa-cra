import {Project} from "~/lib/client";
import {useEffect, useState} from "react";
import { Days, isWeekendDay } from "~/lib/date";
import { NumberInput } from "~/components/InputNumber";
import { updateArrayByUniqKey } from "~/lib/array/updateArrayByUniqKey";
import { ProjectSelection } from "~/pages/timesheets/create";

export const TimesheetRow = ({
    handleChangeCell,
    project,
    task,
    days,
  }: {
    handleChangeCell?: (days: { value: number; currDate: string }[]) => void,
    project: ProjectSelection,
    task?: { taskTitle: string, projectTaskId: string },
    days: Days,
}) => {
    const [totalDaysWorked, setTotalDaysWorked] = useState<
        { value: number; currDate: string }[]
    >(days.map((day) => ({ value: 0, currDate: day.currDate })));

    useEffect(() => {
        handleChangeCell?.(totalDaysWorked);
    }, [handleChangeCell, totalDaysWorked]);

    return (
        <tr>
            <td><p className="p-2">{project.projectName} / {task.taskTitle}</p></td>
            {
                days.map((day) => {
                    return (
                        <td key={day.currDate} className={isWeekendDay(day.dayOfWeek) ? "bg-gray-200" : ""}>
                            <NumberInput
                                disabled={isWeekendDay(day.dayOfWeek)}
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
    );
}