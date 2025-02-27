import {useEffect, useState} from "react";
import {Button, Table, useMantineTheme} from "@mantine/core";

import {getAllDaysInCurrentMonth, isWeekendDay} from "~/lib/date";
import {TimesheetRow} from "~/components/TimesheetRow";
import {TimesheetRowTotal} from "~/components/TimesheetRowTotal";
import {Task, Tasks} from "~/pages/admin/timesheets";


const EmptyRow = () => {
    return (<tr>
        <td colSpan={33} align={'left'} style={{color: '#CC0000', fontStyle: 'italic'}}>Please select a project and add some task(s)...</td>
    </tr>)
}

const add = (a: number, b: number) => a + b
const arraySum = (arr: number[]) => Array.isArray(arr) ? arr.reduce(add, 0) : 0

const sumAllTasks = (tasks: Tasks) => {
    const total = Array.from({ length: tasks[0].row.length }, () => 0)

    return tasks.reduce((acc, task) => {
        return task.row.map((el, idx) => {
            return el + acc[idx]
        })
    }, total)
}

const calculateRowTotalV2 = (month: number, tasks: Tasks) => {
    if (tasks.length === 0) {
        const days = getAllDaysInCurrentMonth(month);
        return Array.from({ length: days.length }, () => 0);
    }

    if (tasks.length === 1) {
        return tasks[0].row
    }

    return sumAllTasks(tasks)
}

type Timesheets = {
    [key: string]: number[]
}

export const Timesheet = ({ month, tasks, handleClickSave, handleUpdateTasks }: { month: number, tasks: Tasks, handleClickSave: () => void, handleUpdateTasks: (task: Task) => void }) => {
    const [timesheets, setTimesheets] = useState<Timesheets>({});
    const [timesheetTotalDays, setTimesheetTotalDays] = useState<number>(0);
    const [timesheetTotalRow, setTimesheetTotalRow] = useState<number[]>(calculateRowTotalV2(month, tasks));
    const theme = useMantineTheme();

    const days = getAllDaysInCurrentMonth(month);

    const handleUpdateTimesheet = (projectTaskId: string, days: number[]) => {
        const newTimesheets = {
            ...timesheets,
            [projectTaskId]: days,
        }

        setTimesheets(newTimesheets)

        const task: Task = {
            projectTaskId,
            projectName: '',
            taskTitle: '',
            row: days
        }

        handleUpdateTasks(task)
    }

    useEffect(() => {
        const rowTotal = calculateRowTotalV2(month, tasks)
        const total = arraySum(rowTotal)

        setTimesheetTotalRow(rowTotal)
        setTimesheetTotalDays(total as number)
    }, [tasks])

    return(
        <>
            <Table.ScrollContainer minWidth={500}>
                <Table highlightOnHover >
                <Table.Thead>
                <Table.Tr>
                    <Table.Td style={{minWidth: '110px'}}></Table.Td>
                    {
                        days.map((day) => {
                            return (
                                <Table.Th  key={day.currDate} style={isWeekendDay(day.dayOfWeek) ? {
                                    backgroundColor: theme.colors.gray[6],
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: theme.colors.gray[5]
                                } : {
                                    textAlign: "center",
                                    fontWeight: "bold"
                                }}
                                >
                                    <p>{day.currDate}</p>
                                </Table.Th>
                            );
                        })
                    }
                    <Table.Td style={{ "textAlign": "center", "fontWeight": "bold", "minWidth": "110px" }}>Total</Table.Td>
                </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                {
                    tasks.length === 0 ? <EmptyRow />  : tasks.map((task) => {
                        return (<TimesheetRow key={`${task.projectTaskId}`} task={task} days={days} handleUpdateTimesheet={handleUpdateTimesheet} />)
                    })
                }

                {
                    tasks.length > 0 && <TimesheetRowTotal
                        days={days}
                        timesheetTotalRow={timesheetTotalRow}
                        timesheetTotalDays={timesheetTotalDays}
                    />
                }

                </Table.Tbody>
            </Table>
            </Table.ScrollContainer>
            <div>
                <Button onClick={handleClickSave}>Save timesheet</Button>
            </div>
        </>
    )
}