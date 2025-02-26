import {Days, isWeekendDay} from "~/lib/date";
import {Table, useMantineTheme} from "@mantine/core";

export const TimesheetRowTotal = ({days, timesheetTotalDays, timesheetTotalRow}: {days: Days, timesheetTotalDays: number, timesheetTotalRow: number[]}) => {
    const theme = useMantineTheme();

    return (
        <Table.Tr>
            <Table.Td><p className="p-2" style={{'fontWeight': 'bold', textAlign: 'right'}}>Total</p></Table.Td>
            {
                days.map((day, idx) => {
                    return (
                        <Table.Td key={`total-${idx}`}
                            style={isWeekendDay(day.dayOfWeek) ? {
                                backgroundColor: theme.colors.gray[6],
                                textAlign: "center",
                                fontWeight: "normal",
                                color: theme.colors.gray[5]
                            } : {
                                textAlign: "center",
                                fontWeight: "bold"

                            }}
                        >
                            <p className="p-2" style={{'fontWeight': 'bold', textAlign: 'center'}}>{timesheetTotalRow[idx]}</p>
                        </Table.Td>
                    );
                })
            }
            <Table.Td style={{ "textAlign": "center", "fontWeight": "bold" }}>
                <p className="p-2">{timesheetTotalDays}</p>
            </Table.Td>
        </Table.Tr>
    )
}