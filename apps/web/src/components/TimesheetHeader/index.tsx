import { Days, getAllDaysInCurrentMonth, getCurrentMonth, isWeekendDay } from "~/lib/date";
import {Select} from "~/components/Select";

type Options = {
    handleClickPrevious: () => void
    handleClickNext: () => void
    handleChangeProject: (value: string) => void
    handleClickTaskAdd: () => void
    refProjectDropdown: React.RefObject<HTMLSelectElement>
    refTaskDropdown: React.RefObject<HTMLSelectElement>
    month: number
    projects: any[]
    projectTasks: any[]
}

export const TimesheetHeader = (options: Options) => {
    const days = getAllDaysInCurrentMonth(options.month);

    const getNbWorkingDays = (days: Days) => days.reduce(
        (acc, day) => (isWeekendDay(day.dayOfWeek) ? acc : acc + 1),
        0,
    );

    return (
        <>
            <div className="mb-3" style={{'display': 'flex', 'justifyContent': 'space-between'}}>
                <button onClick={options.handleClickPrevious}>&lt;</button>

                <span  style={{'textAlign': 'center'}}>
                        <span className="text-4xl font-bold">{getCurrentMonth(options.month)}</span>
                        <span style={{fontStyle: "italic"}}>(working days: <strong>{getNbWorkingDays(days)}</strong>)</span>
                    </span>

                <button  onClick={options.handleClickNext}>&gt;</button>
            </div>
            <hr  className="mb-3" />

            <div className={"mb-3"}>
                <span style={{display: "inline-block", minWidth: '100px', fontWeight: 'bold'}}>Projects</span>
                <Select
                    ref={options.refProjectDropdown}
                    options={options.projects}
                    getOptionLabel={(project) => project.name}
                    getOptionValue={(project) => project.id}
                    onChange={options.handleChangeProject}
                    defaultValue={''}
                />
            </div>

            {
                options.projectTasks && (
                    <div className={"mb-3"}>
                        <span style={{display: "inline-block", minWidth: '100px', fontWeight: 'bold'}}>Tasks</span>
                        <Select
                            ref={options.refTaskDropdown}
                            options={options.projectTasks}
                            getOptionLabel={(project) => project.task_description}
                            getOptionValue={(project) => project.id}
                            onChange={options.handleChangeProject}
                            defaultValue={''}
                        />&nbsp;
                        <button className="button" onClick={options.handleClickTaskAdd}>ADD</button>
                    </div>
                )
            }

            <hr  className="mb-3" />
        </>
    )
}