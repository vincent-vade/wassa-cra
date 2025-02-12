import {Days, isWeekendDay} from "~/lib/date";
import {Tasks} from "~/pages/timesheets/create";

export const TimesheetRowTotal = ({days, tasks, timesheetTotalDays, timesheetTotalRow}: {days: Days, tasks: Tasks, timesheetTotalDays: number, timesheetTotalRow: number[]}) => {
    return (
        <tr>
            <td><p className="p-2" style={{'fontWeight': 'bold', textAlign: 'right'}}>Total</p></td>
            {/*{*/}
            {/*    timesheetTotalRow.map((total, idx) => {*/}
            {/*        return (*/}
            {/*            <td key={`total-${idx}`} className={isWeekendDay(days[idx].dayOfWeek) ? "bg-gray-200" : ""} style={{ "textAlign": "center", "fontWeight": "bold" }}>*/}
            {/*                <p className="p-2">{total}</p>*/}
            {/*            </td>*/}
            {/*        );*/}
            {/*    })*/}
            {/*}*/}
            {
                days.map((day, idx) => {
                    return (
                        <td key={`total-${idx}`} className={isWeekendDay(day.dayOfWeek) ? "bg-gray-200" : ""} style={{ "textAlign": "center", "fontWeight": "bold" }}>
                            <p className="p-2" style={{'fontWeight': 'bold', textAlign: 'center'}}>{timesheetTotalRow[idx]}</p>
                        </td>
                    );
                })
            }
            <td style={{ "textAlign": "center", "fontWeight": "bold" }}>
                <p className="p-2">{timesheetTotalDays}</p>
            </td>
        </tr>
    )
}