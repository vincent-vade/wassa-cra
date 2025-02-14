import {getAllDaysInCurrentMonth, isWeekendDay} from "~/lib/date";
import {TimesheetRow} from "~/components/TimesheetRow";
import {TimesheetRowTotal} from "~/components/TimesheetRowTotal";
import {useEffect, useState} from "react";

import {Tasks, Task} from "~/pages/timesheets/create";

const EmptyRow = () => {
    return (<tr>
        <td colSpan={9} align={'center'} style={{color: '#CC0000', fontStyle: 'italic'}}>Please select a project and add some task(s)...</td>
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
            <div style={{ "overflowX": "auto" }}>
                <table>
                <thead>
                <tr>
                    <td style={{minWidth: '110px'}}></td>
                    {
                        days.map((day) => {
                            return (
                                <td  key={day.currDate} className={isWeekendDay(day.dayOfWeek) ? "bg-gray-200" : ""} style={{ "textAlign": "center", "fontWeight": "bold", "minWidth": "58px" }}>
                                    <p>{day.currDate}</p>
                                </td>
                            );
                        })
                    }
                    <td style={{ "textAlign": "center", "fontWeight": "bold", "minWidth": "110px" }}>Total</td>
                </tr>
                </thead>
                <tbody>
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

                </tbody>
            </table>
            </div>
            <div>
                <button onClick={handleClickSave}>Save timesheet</button>
            </div>
        </>
    )
}