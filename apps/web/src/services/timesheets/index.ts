import {client, CreateTimesheet, Timesheet} from "~/lib/client";

export const getTimesheets = async () => {
    const response = await client.GET("/api/rest/timesheets");
    return response.data?.timesheets as Timesheet[];
};

export const getTimesheetById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/timesheets/${id}`);
    return data?.timesheet as Timesheet;
};

export const createTimesheet = async (timesheet: CreateTimesheet) => {
    try {
        const result = await client.POST("/api/rest/timesheets", {
            body: timesheet
        });
        return result
    } catch (e) {
        throw new Error('Error creating timesheet', e);

    }
    // return []; //data?.timesheet as Timesheet;
};