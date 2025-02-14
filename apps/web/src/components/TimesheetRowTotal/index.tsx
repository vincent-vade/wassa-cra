import {Days, isWeekendDay} from "~/lib/date";

export const TimesheetRowTotal = ({days, timesheetTotalDays, timesheetTotalRow}: {days: Days, timesheetTotalDays: number, timesheetTotalRow: number[]}) => {
    console.log('[Component][TimesheetRowTotal] timesheetTotalRow =>', timesheetTotalRow)
    return (
        <tr>
            <td><p className="p-2" style={{'fontWeight': 'bold', textAlign: 'right'}}>Total</p></td>
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