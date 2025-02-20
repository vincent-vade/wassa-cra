import {
    client,
    CreateTimesheet,
    Timesheet,
    TimesheetByProjectTaskIdAndPeriod,
    TimesheetsByPeriod,
    UpdateTimesheetByPeriod
} from "~/lib/client";

export const getTimesheets = async () => {
    const response = await client.GET("/api/rest/timesheets");
    return response.data?.timesheets as Timesheet[];
};

export const updateTimesheetByPeriod = async (period: string, projectTaskId: string, working_durations: number[]) => {
    const response = await client.PUT(`/api/rest/timesheets/period/{period}`, {
        params: {
            path: {
                period
            }
        },
        body: {
            project_task_id: projectTaskId,
            newData: {
                working_durations,
            }
        }
    })
    return response as UpdateTimesheetByPeriod;
}

export const getTimesheetsByPeriod = async (period: string) => {
    const response = await client.GET(`/api/rest/timesheets/period/{period}`, {
        params: {
            path: {
                period
            }
        }
    });
    return response.data?.timesheets as TimesheetsByPeriod[];
};

export const getTimesheetsByProjectTaskIdAndPeriod = async (period: string, projectTaskId: string) => {
    const response = await client.GET('/api/rest/timesheets/project-task/{project_task_id}/period/{period}', {
        params: {
            path: {
                project_task_id: projectTaskId,
                period
            }
        }
    });
    return response.data?.timesheets as TimesheetByProjectTaskIdAndPeriod[];
};

export const getTimesheetById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/timesheets/{id}`, {
        params: {
            id,
        }
    });
    return data?.timesheets_by_pk as Timesheet;
};

export const createTimesheet = async (timesheet: CreateTimesheet) => {
    try {
        const result = await client.POST('/api/rest/timesheets', {
            body: timesheet
        });
        return result
    } catch (e) {
        throw new Error('Error creating timesheet', e);

    }
    // return []; //data?.timesheet as Timesheet;
};