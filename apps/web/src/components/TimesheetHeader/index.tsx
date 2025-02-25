import { Days, getAllDaysInCurrentMonth, getCurrentMonth, isWeekendDay } from "~/lib/date";
import {NumberInput, NativeSelect, Group, Button} from "@mantine/core"
import {ChangeEvent, useState} from "react";
import {Projects, ProjectTasks} from "~/lib/client";

type Options = {
    handleClickPrevious: () => void
    handleClickNext: () => void
    handleChangeProject: (e: ChangeEvent<HTMLSelectElement>) => void
    handleChangeProjectTasks: (e: ChangeEvent<HTMLSelectElement>) => void
    handleClickTaskAdd: () => void
    refProjectDropdown: React.RefObject<HTMLSelectElement>
    refTaskDropdown: React.RefObject<HTMLSelectElement>
    month: number
    projects: any[]
    projectTasks: any[]
}

type OptionItem = {
    label: string
    value: string
}

const buildProjects = (projects: Projects): OptionItem[] => {
    if (!projects) return []

    return projects.map((project) => {
        return {
            label: project?.name,
            value: project?.id
        }
    })
}

const buildProjectTasks = (projectTasks: ProjectTasks): OptionItem[] => {
    if (!projectTasks) return []

    return projectTasks.map((task) => {
        console.log("task", task)
        return {
            label: task?.task_description,
            value: task?.id
        }
    })
}

const emptyOptionItem = {
    label: 'Please select an item',
    value: ''
}
export const TimesheetHeader = (options: Options) => {
    const [projects] = useState<OptionItem[]>([emptyOptionItem, ...buildProjects(options.projects)]);
    // const [projectTasks, setProjectTasks] = useState<OptionItem[]>([emptyOptionItem, ...buildProjectTasks(options.projectTasks)]);

    console.log('projectTasks', options.projectTasks)

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

            <Group>
                <NativeSelect
                    data={projects}
                    label="Select project"
                    onChange={options.handleChangeProject}
                    defaultValue={'Select project'}
                />
                {
                    options.projectTasks && (
                        <Group align={'flex-end'}>
                                <NativeSelect
                                    data={[emptyOptionItem, ...buildProjectTasks(options.projectTasks)]}
                                    label="Select task"
                                    onChange={options.handleChangeProjectTasks}
                                    defaultValue={'Please select an item'}
                                />

                                <Button onClick={options.handleClickTaskAdd}>ADD</Button>
                        </Group>
                    )
                }
            </Group>



            <hr  className="mb-3" />
        </>
    )
}