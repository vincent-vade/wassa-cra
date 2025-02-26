import {useEffect, useState} from "react";
import { Table, NumberInput, useMantineTheme } from "@mantine/core";

import { Days, isWeekendDay } from "~/lib/date";

export const TimesheetRow = ({
     task,
     days,
     handleUpdateTimesheet
}: {
    task: { taskTitle: string, projectTaskId: string, projectName: string, row: number[] },
    days: Days,
    handleUpdateTimesheet: (taskId: string, days: number[]) => void
}) => {
    const [totalDaysWorked, setTotalDaysWorked] = useState<number>(0);
    const [daysInput, setDaysInput] = useState<number[]>(task.row || []);

    const theme = useMantineTheme();

    useEffect(() => {
        const totalDays = daysInput.reduce((acc, curr) => {
            return acc + curr
        }, 0);

        setTotalDaysWorked(totalDays);
    }, [daysInput])

    const updateRow = (val: number, taskId: string, idx: number): void => {
        const newDaysInput = daysInput.map((input, newIdx) => {
            return newIdx === idx ? val : input;
        });

        setDaysInput(newDaysInput);

        handleUpdateTimesheet(taskId, newDaysInput);
    }

    return (
        <Table.Tr>
            <Table.Td><p className="p-2">{task.projectName} / {task.taskTitle}</p></Table.Td>
            {
                days.map((day, idx) => {
                    const defaultValue = daysInput[idx] || 0;
                    return (
                        <Table.Td key={day.currDate}
                            style={isWeekendDay(day.dayOfWeek) ? {
                                backgroundColor: theme.colors.gray[6],
                            } : {}}
                        >
                            <NumberInput
                                min={0}
                                max={1}
                                step={0.5}
                                style={{ minWidth: 70 }}
                                defaultValue={defaultValue}
                                disabled={isWeekendDay(day.dayOfWeek)}
                                onChange={(value) => updateRow(value, task.projectTaskId, idx)}
                            />
                        </Table.Td>
                    );
                })
            }
            <Table.Td><p style={{ "textAlign": "center", "fontWeight": "bold" }}>{totalDaysWorked}</p></Table.Td>
        </Table.Tr>
    );
}