import {getAllDaysInCurrentMonth, isWeekendDay} from "~/lib/date";
import {TimesheetRow} from "~/components/TimesheetRow";
import {TimesheetRowTotal} from "~/components/TimesheetRowTotal";
import {useEffect, useState} from "react";
import {Tasks} from "~/pages/timesheets/create";

const EmptyRow = () => {
    return (<tr>
        <td colSpan={9} align={'center'} style={{color: '#CC0000', fontStyle: 'italic'}}>Please select a project and add some task(s)...</td>
    </tr>)
}

const add = (a, b) => a + b
const arraySum = (arr: number[]) => Array.isArray(arr) ? arr.reduce(add, 0) : 0

const calculateRowTotal = (timesheets: {[taskId: string]: number[]}): number[] => {
    if (Object.values(timesheets).length === 0) return [0]

    return Object.values(timesheets).reduce((acc, el) => {
        return acc.map((a, idx) => {
            return a + el[idx]
        })
    })
}

type Timesheets = {
    [key: string]: number[]
}

export const Timesheet = ({ month, timesheet, handleClickSave }: { month: number, timesheet: Tasks, handleClickSave: () => void }) => {
    const [timesheets, setTimesheets] = useState<Timesheets>({});
    const [timesheetTotalDays, setTimesheetTotalDays] = useState(0);
    const [timesheetTotalRow, setTimesheetTotalRow] = useState<number>(0);

    const days = getAllDaysInCurrentMonth(month);

    const handleUpdateTimesheet = (projectTaskId: string, days: number[]) => {
        const newTimesheets = {
            ...timesheets,
            [projectTaskId]: days,
        }

        setTimesheets(newTimesheets)
    }

    useEffect(() => {
        const rowTotal = calculateRowTotal(timesheets)
        const total = arraySum(rowTotal)

        setTimesheetTotalRow(rowTotal)
        setTimesheetTotalDays(total as number)
    }, [timesheets])

    return(
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
                    timesheet.length === 0 ? <EmptyRow />  : timesheet.map((task) => {
                        return (<TimesheetRow key={`${task.projectTaskId}`} task={task} days={task.row} handleUpdateTimesheet={handleUpdateTimesheet} />)
                    })
                }

                {
                    timesheet.length > 0 && <TimesheetRowTotal
                        days={days}
                        timesheetTotalRow={timesheetTotalRow}
                        timesheetTotalDays={timesheetTotalDays}
                    />
                }

                </tbody>
            </table>

            <div>
                <button onClick={handleClickSave}>Save timesheet</button>
            </div>
        </div>
    )
}