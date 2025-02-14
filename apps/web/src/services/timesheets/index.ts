import {client, CreateTimesheet, Timesheet, TimesheetsByPeriod} from "~/lib/client";

export const getTimesheets = async () => {
    const response = await client.GET("/api/rest/timesheets");
    return response.data?.timesheets as Timesheet[];
};

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

export const getTimesheetById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/timesheets/${id}`);
    return data?.timesheet as Timesheet;
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