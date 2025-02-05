import {client, CreateTimesheet, Timesheet} from "~/lib/client";

export const getTimesheets = async () => {
    const { data } = await client.GET("/api/rest/timesheets");
    return data?.timesheets as Timesheet[];
};

export const getTimesheetById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/timesheets/${id}`);
    return data?.timesheet as Timesheet;
};

export const createTimesheet = async (timesheet: CreateTimesheet) => {
    try {
        const { data } = await client.POST("/api/rest/timesheets", timesheet);
        return data
    } catch (e) {
        throw new Error('Error creating timesheet', e);

    }
    // return []; //data?.timesheet as Timesheet;
};